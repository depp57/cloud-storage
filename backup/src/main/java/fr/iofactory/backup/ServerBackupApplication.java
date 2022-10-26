package fr.iofactory.backup;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerBackupApplication {

	public static void main(String[] args) {
		double a = 3.0;
		int b = 2;

		System.out.println(a/b);

		SpringApplication.run(ServerBackupApplication.class, args);
	}
}
