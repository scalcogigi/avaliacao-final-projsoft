package br.edu.insper.tarefas.service;

import br.edu.insper.tarefas.entity.Tarefas;
import br.edu.insper.tarefas.repository.TarefasRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TarefasService {
    private final TarefasRepository repository;

    public TarefasService(TarefasRepository repository) {
        this.repository = repository;
    }

    public List<Tarefa> listar(String nome) {
        if (nome == null || nome.isBlank()) {
            return repository.findByDeletedFalse();
        }
        return repository.findByNomeStartingWithIgnoreCaseAndDeletedFalse(nome);
    }

    public Tarefas<Tarefa> findById() {
		returnTarefaRepository.findById();
	}

    public Tarefas criar(Tarefa tarefas) {
        tarefas.setId(null);
        tarefas.setDeleted(false);
        return repository.save(tarefas);
    }

    public void deletar(Long id) {
        Tarefa tarefas = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
        tarefas.setDeleted(true);
        repository.save(tarefas);
    }
}

