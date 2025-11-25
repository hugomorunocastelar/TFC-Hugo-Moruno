package dot.server.auth.controllers;


import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.request.LoginRequest;
import dot.server.auth.payload.request.ResetPasswordRequest;
import dot.server.auth.payload.request.SignupRequest;
import dot.server.auth.payload.response.JwtResponse;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.auth.role.model.Role;
import dot.server.auth.role.repository.RoleRepository;
import dot.server.auth.user.model.User;
import dot.server.auth.user.repository.UserRepository;
import dot.server.auth.user.service.UserService;
import dot.server.auth.user.service.impl.UserDetailsImpl;
import dot.server.auth.verification.model.VerificationToken;
import dot.server.auth.verification.repository.VerificationTokenRepository;
import dot.server.mail.service.EmailService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserService userService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    EmailService emailService;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    VerificationTokenRepository verificationTokenRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userService.findById(userDetails.getId());
        if (!user.getEnabled()) {
            List<VerificationToken> tokens = verificationTokenRepository.findByUserId(user.getId()).orElse(null);
            boolean userHasBeenVerified = true;
            if (tokens != null && !tokens.isEmpty())
                for (VerificationToken token : tokens) {
                    if (token.getType().equals("VERIFY")) userHasBeenVerified = false;
                }

            if (!userHasBeenVerified) {
                sendEmail(user, "VERIFY");
                return ResponseEntity.ok(
                    new HttpResponse(HttpStatus.PRECONDITION_REQUIRED, "Usuario no verificado."));
            }
            return ResponseEntity.ok(
                    new HttpResponse(HttpStatus.UNAUTHORIZED, "Usuario deshabilitado, contacta con un administrador.")
            );
        }
        else
            return ResponseEntity.ok(
                new HttpResponse(HttpStatus.OK,
                new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles))
            );
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
        @RequestBody SignupRequest signUpRequest
    ) {
        if (!signUpRequest.isLopd()) {
            return ResponseEntity.badRequest().body("Por favor acepte la Lopd para continuar con el registro.");
        }

        if (!signUpRequest.getPassword().equals(signUpRequest.getPasswordRepeat())) {
            return ResponseEntity.badRequest().body("Las contraseñas no se corresponden entre si.");
        }

        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new HttpResponse(HttpStatus.BAD_REQUEST, "Nombre de usuario ocupado."));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new HttpResponse(HttpStatus.BAD_REQUEST, "Email de usuario ocupado."));
        }

        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName("ROLE_USER").orElse(null);
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                                .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                        roles.add(adminRole);

                        break;
                    case "referee":
                        Role refRole = roleRepository.findByName("ROLE_REFEREE")
                                .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                        roles.add(refRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName("ROLE_USER")
                                .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);
        sendEmail(user, "VERIFY");

        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Usuario registrado exitosamente, confirme su email para activar el usuario."));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam String token) {
        VerificationToken tokenData = verificationTokenRepository.findByToken(token).orElse(null);

        if (tokenData == null)
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "El token no existe."));

        User user = tokenData.getUser();

        if (tokenData.getExpiryDate().isBefore(LocalDateTime.now())) {
            sendEmail(user, "VERIFY");
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "Token expirado. Se procede a reenviar el código."));
        }

        user.setEnabled(true);
        userRepository.save(user);
        verificationTokenRepository.delete(tokenData);

        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Cuenta verificada con éxito."));
    }

    @GetMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null)
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "No existe una cuenta con ese correo."));
        if (!user.getEnabled())
            return ResponseEntity.ok(new HttpResponse(HttpStatus.UNAUTHORIZED, "Usuario deshabilitado, contacta con un administrador."));
        sendEmail(user, "RESETPASSWORD");
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Se ha enviado un correo para restablecer la contraseña."));
    }

    @Transactional
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequest request
    ) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(request.getToken()).orElse(null);
        if (verificationToken == null)
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "Token inválido."));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            sendEmail(verificationToken.getUser(), "RESETPASSWORD");
            return ResponseEntity.badRequest().body(new HttpResponse(HttpStatus.BAD_REQUEST, "El token ha expirado. Se procede a reenviar el código."));
        }

        if (request.getNewPassword().equals(request.getConfirmPassword())) {
            User user = verificationToken.getUser();
            user.setPassword(encoder.encode(request.getNewPassword()));
            userRepository.save(user);
            verificationTokenRepository.delete(verificationToken);
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Contraseña actualizada con éxito."));
        } else {
            return ResponseEntity.ok().body(new HttpResponse(HttpStatus.BAD_REQUEST, "Las contraseñas deben ser iguales entre si."));
        }
    }

    private void sendEmail(User user, String type) {
        int plusHours = type.equals("RESETPASSWORD") ? 1 : 24;
        boolean sendNewCode = true;
        VerificationToken oldToken = null;

        List<VerificationToken> tokens = verificationTokenRepository.findByUserId(user.getId()).orElse(null);

        if (tokens != null && !tokens.isEmpty())  {
            for (VerificationToken token : tokens) {
                if (token.getType().equals(type)) {
                    sendNewCode = false;
                    oldToken = token;
                }
            }
        }

        if (sendNewCode) {
            String token = UUID.randomUUID().toString().substring(0, 19);
            VerificationToken verificationToken = new VerificationToken();
            verificationToken.setToken(token);
            verificationToken.setUser(user);
            verificationToken.setType(type);
            verificationToken.setExpiryDate(LocalDateTime.now().plusHours(plusHours));
            verificationTokenRepository.save(verificationToken);
            if (type.equals("RESETPASSWORD")) {
                String resetLink = "https://dot-dot.duckdns.org/reset-password?token=" + token;
                emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            }
            else if (type.equals("VERIFY"))
                emailService.sendVerificationEmail(user.getEmail(), token);

        } else {
            oldToken.setExpiryDate(LocalDateTime.now().plusHours(plusHours));
            verificationTokenRepository.save(oldToken);
            if (type.equals("RESETPASSWORD")) {
                String resetLink = "https://dot-dot.duckdns.org/reset-password?token=" + oldToken.getToken();
                emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
            }
            else if (type.equals("VERIFY"))
                emailService.sendVerificationEmail(user.getEmail(), oldToken.getToken());
        }
    }
}
