package br.edu.insper.tarefas.repository;

import br.edu.insper.tarefas.entity.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TarefasRepository extends JpaRepository<Tarefa, Long> {
    List<Tarefa> findByDeletedFalse();
    List<Tarefa> findByNomeStartingWithIgnoreCaseAndDeletedFalse(String nome);
    List<Tarefa> findByID(long id);
}

