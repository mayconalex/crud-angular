import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tarefa } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

    constructor() { }

    private tarefasSubject = new BehaviorSubject<Tarefa[]>([
        { id: 1, descricao: 'Implementar o CRUD completo', prioridade: 5, concluida: false },
        { id: 2, descricao: 'Estudar a arquitetura Standalone', prioridade: 4, concluida: true },
    ]);

    public tarefas$ = this.tarefasSubject.asObservable();

    addTarefa(novaTarefa: Omit<Tarefa, 'id'>) {
        const listaAtual = this.tarefasSubject.getValue();
        const novaLista = [...listaAtual, { ...novaTarefa, id: Date.now() }];
        this.tarefasSubject.next(novaLista);
    }

    updateTarefa(tarefaAtualizada: Tarefa) {
        const listaAtual = this.tarefasSubject.getValue();
        const novaLista = listaAtual.map(t =>
            (t.id === tarefaAtualizada.id ? tarefaAtualizada : t)
        );
        this.tarefasSubject.next(novaLista);
    }

    deleteTarefa(id: number) {
        const listaAtual = this.tarefasSubject.getValue();
        const novaLista = listaAtual.filter(t => t.id !== id);
        this.tarefasSubject.next(novaLista);
    }
}
