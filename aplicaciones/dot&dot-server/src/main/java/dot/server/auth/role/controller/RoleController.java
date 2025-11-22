package dot.server.auth.role.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/roles")
public class RoleController {

//    @Autowired
//    private RoleService serv;
//
//    @GetMapping()
//    public ResponseEntity<?> find(
//        @RequestParam(required = false) Long id,
//        @RequestParam(required = false) String name
//    ) {
//        if (id == null && (name == null || name.isEmpty())) {
//            return ResponseEntity.ok(RoleDto.from(serv.findAll()));
//        } else if (id != null) {
//            return ResponseEntity.ok(RoleDto.from(serv.findById(id)));
//        } else {
//            return ResponseEntity.ok(RoleDto.from(serv.findByName(name)));
//        }
//    }
//
//    @PostMapping("")
//    public ResponseEntity<?> create(@RequestBody RoleDto roleDto) {
//        if (roleDto == null) throw new EmptyDataSentException();
//        return ResponseEntity.ok(RoleDto.from(serv.save(roleDto.to())));
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody RoleDto roleDto) {
//        if (id == null || roleDto == null) throw new EmptyDataSentException();
//
//        Role updated = serv.update(id, roleDto.to());
//        return ResponseEntity.ok(RoleDto.from(updated));
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> delete(@PathVariable Long id) {
//        if (id == null) throw new EmptyDataSentException();
//        serv.delete(id);
//        return ResponseEntity.ok("Borrado correctamente.");
//    }
}
