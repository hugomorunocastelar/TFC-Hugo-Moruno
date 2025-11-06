package dot.server.auth.controllers;


import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.role.model.Role;
import dot.server.auth.user.model.User;
import dot.server.auth.verification.model.VerificationToken;
import dot.server.auth.payload.request.LoginRequest;
import dot.server.auth.payload.request.SignupRequest;
import dot.server.auth.payload.response.JwtResponse;
import dot.server.auth.payload.response.MessageResponse;
import dot.server.auth.role.repository.RoleRepository;
import dot.server.auth.user.repository.UserRepository;
import dot.server.auth.verification.repository.VerificationTokenRepository;
import dot.server.auth.user.service.impl.UserDetailsImpl;
import dot.server.auth.user.service.UserService;
import dot.server.mail.service.EmailService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
    List<String> roles = userDetails.getAuthorities()
        .stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.toList());

    return ResponseEntity.ok(new JwtResponse(jwt,
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(
          @Valid @RequestBody SignupRequest signUpRequest
  ) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: ¡El nombre de usuario ya está en uso!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: ¡El email de usuario ya está en uso!"));
    }

    User user = new User(signUpRequest.getUsername(),
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName("ROLE_USER")
          .orElseThrow(() -> new RuntimeException("Error: Rol no encontrado."));
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

    String token = UUID.randomUUID().toString();
    VerificationToken verificationToken = new VerificationToken();
    verificationToken.setToken(token);
    verificationToken.setUser(user);
    verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
    verificationTokenRepository.save(verificationToken);

    emailService.sendVerificationEmail(user.getEmail(), token);

    return ResponseEntity.ok(new MessageResponse("¡El usuario ha sido registrado! Revisa tu correo para confirmar la cuenta."));
  }

  @GetMapping("/validate")
  public ResponseEntity<?> validateUser(
      @RequestHeader("Authorization") String token
  ) {
    token = token.substring(7);
    if (jwtUtils.validateJwtToken(token))
      return ResponseEntity.ok(true);
    else
      return ResponseEntity.ok(false);
  }

  @GetMapping("/verify")
  public ResponseEntity<?> verifyAccount(@RequestParam String token) {
    Optional<VerificationToken> optToken = verificationTokenRepository.findByToken(token);

    if (optToken.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Token inválido"));
    }

    VerificationToken verificationToken = optToken.get();
    if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Token expirado"));
    }

    User user = verificationToken.getUser();
    user.setEnabled(true);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("Cuenta verificada con éxito."));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<?> forgotPassword(@RequestParam String email) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("No existe una cuenta con ese correo."));
    }

    User user = userOpt.get();

    userService.deleteById(user.getId());

    String token = UUID.randomUUID().toString();
    VerificationToken resetToken = new VerificationToken();
    resetToken.setToken(token);
    resetToken.setUser(user);
    resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
    verificationTokenRepository.save(resetToken);

    String resetLink = "https://dot-dot.duckdns.org/server/reset-password?token=" + token;
    emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

    return ResponseEntity.ok(new MessageResponse("Se ha enviado un correo para restablecer la contraseña."));
  }

  @Transactional
  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
    Optional<VerificationToken> optToken = verificationTokenRepository.findByToken(token);
    if (optToken.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("Token inválido."));
    }

    VerificationToken verificationToken = optToken.get();

    if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
      return ResponseEntity.badRequest().body(new MessageResponse("El token ha expirado."));
    }

    User user = verificationToken.getUser();
    user.setPassword(encoder.encode(newPassword));
    userRepository.save(user);

    verificationTokenRepository.delete(verificationToken);

    return ResponseEntity.ok(new MessageResponse("Contraseña actualizada con éxito."));
  }
}
