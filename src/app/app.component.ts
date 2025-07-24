import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TarefaService } from './services/tarefa.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tarefa } from './models/tarefa';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { TarefaListComponent } from './components/tarefa-list/tarefa-list.component';
import { TarefaFormComponent } from './components/tarefa-form/tarefa-form.component';

import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        ToolbarModule, ButtonModule, 
        ToastModule, ConfirmDialogModule,
        TarefaListComponent, TarefaFormComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
    private tarefaService = inject(TarefaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    private tarefasSubject = new BehaviorSubject<Tarefa[]>([]);
    public tarefas$ = this.tarefasSubject.asObservable();

    public dialogVisivel: boolean = false
    public tarefaAtual: Tarefa | null = null

    ngOnInit(): void {
        this.carregarTarefas()
    }

    carregarTarefas(): void {
        this.tarefaService.getTarefas().subscribe(tarefas => {
            this.tarefasSubject.next(tarefas)
        })
    }

    abrirDialogParaNova() {
        this.tarefaAtual = null;
        this.dialogVisivel = true;
    }

    abrirDialogParaEditar(tarefa: Tarefa) {
        this.tarefaAtual = tarefa;
        this.dialogVisivel = true;
    }

    salvarTarefa(tarefa: Omit<Tarefa, 'id'> | Tarefa) {
        if ('id' in tarefa && tarefa.id) {
            this.tarefaService.updateTarefa(tarefa as Tarefa).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Sucesso', detail: 'Tarefa atualizada!' })
                this.carregarTarefas()
            })
        } else {
            this.tarefaService.addTarefa(tarefa as Omit<Tarefa, 'id'>).subscribe(() => {
                this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' })
                this.carregarTarefas()
            })
        }
        
        this.dialogVisivel = false;
    }

    removerTarefa(tarefa: Tarefa) {
        this.confirmationService.confirm({
            message: `Deseja realmente remover a tarefa "${tarefa.descricao}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tarefaService.deleteTarefa(tarefa.id).subscribe(() => {
                    this.messageService.add({ severity: 'warn', summary: 'Confirmado', detail: 'Tarefa removida.' });
                    this.carregarTarefas()
                })
            }
        });
    }
}
