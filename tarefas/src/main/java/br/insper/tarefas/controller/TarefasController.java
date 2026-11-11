package com.insper.tarefas.controller;

import com.insper.tarefas.dto.AvaliacaoRequest;
import com.insper.tarefas.dto.AvaliacaoResponse;
import com.insper.tarefas.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/tarefa")
public class TarefasController {

    private final TarefasService service;

    public TarefasController(TarefasService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TarefasResponse criar(@Valid @RequestBody TarefasRequest request) {
        return service.criar(request);
    }

    @GetMapping
    public List<TarefasResponse> listar() {
        return service.listar();
    }
}
