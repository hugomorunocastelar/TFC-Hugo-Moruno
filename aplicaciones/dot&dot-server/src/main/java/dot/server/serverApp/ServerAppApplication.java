package dot.server.serverApp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ServerAppApplication implements CommandLineRunner {

	@Autowired
	PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(ServerAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		String password = "€#@|cdjnmo";
		System.out.println("Encoded admin password ("+password+"):"+passwordEncoder.encode(password));
	}
}
