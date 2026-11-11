package br.insper.pf;

import org.springframework.boot.SpringApplication;

public class TestPfApplication {

	public static void main(String[] args) {
		SpringApplication.from(PfApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
