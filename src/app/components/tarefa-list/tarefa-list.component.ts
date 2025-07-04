import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tarefa } from '../../models/tarefa';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tarefa-list',
  imports: [TableModule, ButtonModule, TagModule],
  templateUrl: './tarefa-list.component.html',
  styleUrl: './tarefa-list.component.css'
})
export class TarefaListComponent {
    @Input() tarefas: Tarefa[] = []

    @Output() onEdit = new EventEmitter<Tarefa>()
    @Output() onDelete = new EventEmitter<Tarefa>()

    editar(tarefa: Tarefa) {
        this.onEdit.emit(tarefa);
    }

    remover(tarefa: Tarefa) {
        this.onDelete.emit(tarefa)
    }

    getSeveridadePrioridade(prioridade: number) {
        if (prioridade > 3) return "danger"
        if (prioridade > 2) return "warning"
        return "info"
    }
}
