package dot.server.serverApp.auth.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth/test")
public class TestController {
  @GetMapping("/all")
  public boolean allAccess() {
    return true;
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public boolean userAccess() {
    return true;
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public boolean adminAccess() {
    return true;
  }
}
