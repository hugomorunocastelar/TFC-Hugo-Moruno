package dot.server.auth.role.controller;

import dot.server.auth.role.model.Role;
import dot.server.auth.role.model.dto.RoleDto;
import dot.server.auth.role.service.RoleService;
import dot.server.common.error.exceptions.EmptyDataSentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/roles")
public class RoleController {

    @Autowired
    private RoleService serv;

    @GetMapping()
    public ResponseEntity<?> find(
        @RequestParam(required = false) Long id,
        @RequestParam(required = false) String name
    ) {
        if (id == null && (name == null || name.isEmpty())) {
            return ResponseEntity.ok(RoleDto.from(serv.findAll()));
        } else if (id != null) {
            return ResponseEntity.ok(RoleDto.from(serv.findById(id)));
        } else {
            return ResponseEntity.ok(RoleDto.from(serv.findByName(name)));
        }
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody RoleDto roleDto) {
        if (roleDto == null) throw new EmptyDataSentException();
        return ResponseEntity.ok(RoleDto.from(serv.save(roleDto.to())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RoleDto roleDto) {
        if (id == null || roleDto == null) throw new EmptyDataSentException();

        Role updated = serv.update(id, roleDto.to());
        return ResponseEntity.ok(RoleDto.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id == null) throw new EmptyDataSentException();
        serv.delete(id);
        return ResponseEntity.ok("Borrado correctamente.");
    }
}
