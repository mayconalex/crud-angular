import { Component, inject, signal } from '@angular/core';
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
        ToolbarModule, ButtonModule, 
        ToastModule, ConfirmDialogModule,
        TarefaListComponent, TarefaFormComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    private tarefaService = inject(TarefaService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    public tarefas = this.tarefaService.tarefas;
    public dialogVisivel = signal(false);
    public tarefaAtual = signal<Tarefa | null>(null);

    abrirDialogParaNova() {
        this.tarefaAtual.set(null);
        this.dialogVisivel.set(true);
    }

    abrirDialogParaEditar(tarefa: Tarefa) {
        this.tarefaAtual.set(tarefa);
        this.dialogVisivel.set(true);
    }

    salvarTarefa(tarefa: Omit<Tarefa, 'id'> | Tarefa) {
        if ('id' in tarefa && tarefa.id) {
            this.tarefaService.updateTarefa(tarefa as Tarefa);
            this.messageService.add({ severity: 'info', summary: 'Sucesso', detail: 'Tarefa atualizada!' });
        } else {
            this.tarefaService.addTarefa(tarefa as Omit<Tarefa, 'id'>);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
        }
            this.dialogVisivel.set(false);
    }

    removerTarefa(tarefa: Tarefa) {
        this.confirmationService.confirm({
            message: `Deseja realmente remover a tarefa "${tarefa.descricao}"?`,
            header: 'Confirmação de Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.tarefaService.deleteTarefa(tarefa.id);
                this.messageService.add({ severity: 'warn', summary: 'Confirmado', detail: 'Tarefa removida.' });
            }
        });
    }
}
