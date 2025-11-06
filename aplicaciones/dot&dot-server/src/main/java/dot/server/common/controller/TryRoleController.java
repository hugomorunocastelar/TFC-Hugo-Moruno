package dot.server.common.controller;

import dot.server.auth.role.model.Role;
import dot.server.auth.role.model.dto.RoleDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/generic/roles")
public class TryRoleController extends AppController<Role, RoleDto> {
}
