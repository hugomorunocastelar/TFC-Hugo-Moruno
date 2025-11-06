package dot.server.common.controller;

import dot.server.auth.role.model.Role;
import dot.server.common.dto.AppDto;
import dot.server.common.error.exceptions.EmptyDataSentException;
import dot.server.common.service.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

public class AppController<Class, Dto extends AppDto> {

    @Autowired
    private AppService<Class> serv;

    private Dto dto;

    @GetMapping()
    public ResponseEntity<?> find(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name
    ) {
        if (id == null && (name == null || name.isEmpty())) {
            return ResponseEntity.ok(dto.from(serv.findAll()));
        } else if (id != null) {
            return ResponseEntity.ok(dto.from(serv.findById(id)));
        } else {
            return ResponseEntity.ok(dto.from(serv.findByName(name)));
        }
    }

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody Dto data) {
        if (data == null) throw new EmptyDataSentException();
        return ResponseEntity.ok(dto.from(serv.save((Class) data.to())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Dto data) {
        if (id == null || data == null) throw new EmptyDataSentException();

        Class updated = serv.update(id, (Class) data.to());
        return ResponseEntity.ok(dto.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (id == null) throw new EmptyDataSentException();
        serv.delete(id);
        return ResponseEntity.ok("Borrado correctamente.");
    }
}
