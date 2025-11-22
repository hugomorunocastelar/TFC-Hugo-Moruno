package dot.server.auth.user.controller;

import dot.server.auth.user.model.dto.UserDto;
import dot.server.auth.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin("*")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - User Management", description = "CRUD para gestión de usuarios")
public class UserController {

    @Autowired
    private UserService serv;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    @Operation(summary = "Obtener todos los usuarios")
    public ResponseEntity<List<UserDto>> getAll() {
        List<UserDto> users = UserDto.to(serv.findAll());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un usuario por ID")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(UserDto.to(serv.findById(id)));
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo usuario")
    public ResponseEntity<UserDto> create(@Valid @RequestBody UserDto userDto) {
        var password = userDto.getPassword();
        userDto.setPassword(passwordEncoder.encode(password));
        var saved = serv.save(UserDto.from(userDto));
        return ResponseEntity.ok(UserDto.to(saved));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un usuario existente")
    public ResponseEntity<UserDto> update(
            @PathVariable Long id,
            @Valid @RequestBody UserDto userDto
    ) {
        var password = userDto.getPassword();
        userDto.setPassword(passwordEncoder.encode(password));
        var updated = serv.update(id, UserDto.from(userDto));
        if (updated == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(UserDto.to(updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un usuario por ID")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serv.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
