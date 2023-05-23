package ru.kata.spring.boot_security.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import ru.kata.spring.boot_security.demo.services.UserService;

@SpringBootApplication
public class SpringBootSecurityDemoApplication implements CommandLineRunner {

	private final UserService userService;

	@Autowired
	public SpringBootSecurityDemoApplication(UserService userService) {
		this.userService = userService;
	}

	public static void main(String[] args) {
		SpringApplication.run(SpringBootSecurityDemoApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		userService.createAdmin();
	}
}
