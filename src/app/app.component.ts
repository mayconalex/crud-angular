import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TarefaService } from './services/tarefa.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Tarefa } from './models/tarefa';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule, ReactiveFormsModule, TableModule, ButtonModule, ToolbarModule,
        DialogModule, InputTextModule, DropdownModule, ToggleButtonModule, TagModule,
        ConfirmDialogModule, ToastModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'gerenciador-tarefas';

    private tarefaService = inject(TarefaService);
    private fb = inject(FormBuilder);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    public tarefas = this.tarefaService.tarefas;
    public dialogVisivel = signal(false);
    public tarefaAtual = signal<Tarefa | null>(null);
    public tituloDialog = computed(() => this.tarefaAtual() ? 'Editar Tarefa' : 'Nova Tarefa');

    public prioridades = [
        { label: 'Baixa', value: 1 }, { label: 'Média', value: 2 }, { label: 'Alta', value: 3 },
        { label: 'Muito Alta', value: 4 }, { label: 'Urgente', value: 5 }
    ];

    public tarefaForm = this.fb.group({
        id: [null as number | null],
        descricao: ['', Validators.required],
        prioridade: [1, Validators.required],
        concluida: [false]
    });

    abrirDialogParaNova() {
        this.tarefaAtual.set(null);
        this.tarefaForm.reset({ prioridade: 1, concluida: false });
        this.dialogVisivel.set(true);
    }

    abrirDialogParaEditar(tarefa: Tarefa) {
        this.tarefaAtual.set(tarefa);
        this.tarefaForm.patchValue(tarefa);
        this.dialogVisivel.set(true);
    }

    salvarTarefa() {
        if (!this.tarefaForm.valid) return;

        if (this.tarefaAtual()) {
            this.tarefaService.updateTarefa(this.tarefaForm.getRawValue() as Tarefa);
            this.messageService.add({ severity: 'info', summary: 'Sucesso', detail: 'Tarefa atualizada!' });
        } else {
            const { id, ...novaTarefa } = this.tarefaForm.getRawValue();
            this.tarefaService.addTarefa(novaTarefa as Omit<Tarefa, 'id'>);
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
        }

        this.dialogVisivel.set(false);
    }

    removerTarefa(tarefa: Tarefa) {
        this.confirmationService.confirm({
        message: `Deseja realmente remover a tarefa "${tarefa.descricao}"?`,
        header: 'Confirmação de Exclusão', icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sim', rejectLabel: 'Não',
        accept: () => {
            this.tarefaService.deleteTarefa(tarefa.id);
            this.messageService.add({ severity: 'warn', summary: 'Confirmado', detail: 'Tarefa removida.' });
        }
        });
    }

    getSeveridadePrioridade(prioridade: number) {
        if (prioridade > 3) return 'danger';
        if (prioridade > 2) return 'warning';
        return 'info';
    }
}
