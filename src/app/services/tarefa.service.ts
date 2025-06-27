import { Injectable, signal } from '@angular/core';
import { Tarefa } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

    constructor() { }

    private tarefasState = signal<Tarefa[]>([
        { id: 1, descricao: 'Implementar o CRUD completo', prioridade: 5, concluida: false },
        { id: 2, descricao: 'Estudar a arquitetura Standalone', prioridade: 4, concluida: true },
    ]);

    public tarefas = this.tarefasState.asReadonly();

    addTarefa(novaTarefa: Omit<Tarefa, 'id'>) {
        this.tarefasState.update(tarefas => [...tarefas, { ...novaTarefa, id: Date.now() }]);
    }

    updateTarefa(tarefaAtualizada: Tarefa) {
        this.tarefasState.update(tarefas =>
        tarefas.map(t => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t))
        );
    }

    deleteTarefa(id: number) {
        this.tarefasState.update(tarefas => tarefas.filter(t => t.id !== id));
    }

}
