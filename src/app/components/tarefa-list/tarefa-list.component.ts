import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tarefa } from '../../models/tarefa';
import { TarefaService } from '../../services/tarefa.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-tarefa-list',
    standalone: true,
    imports: [CommonModule, RouterLink, TableModule, ButtonModule, TagModule],
    templateUrl: './tarefa-list.component.html',
})
export class TarefaListComponent implements OnInit {
    private tarefaService = inject(TarefaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
    public tarefas$ = this.tarefasSubject.asObservable();

    ngOnInit(): void {
        this.carregarTarefas();
    }

    carregarTarefas(): void {
        this.tarefaService.getTarefas().subscribe(tarefas => {
        this.tarefasSubject.next(tarefas);
        });
    }

    remover(tarefa: Tarefa): void {
        this.confirmationService.confirm({
        message: `Deseja realmente remover a tarefa "${tarefa.descricao}"?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.tarefaService.deleteTarefa(tarefa.id).subscribe(() => {
            this.messageService.add({ severity: 'warn', summary: 'Confirmado', detail: 'Tarefa removida.' });
            this.carregarTarefas();
            });
        }
        });
    }

    getSeveridadePrioridade(prioridade: number) {
        if (prioridade > 3) return "danger";
        if (prioridade > 2) return "warning";
        return "info";
    }
}