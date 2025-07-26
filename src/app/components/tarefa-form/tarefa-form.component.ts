import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TarefaService } from '../../services/tarefa.service';
import { MessageService } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-tarefa-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule, ToggleButtonModule],
  templateUrl: './tarefa-form.component.html',
})
export class TarefaFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private fb = inject(FormBuilder);
  private tarefaService = inject(TarefaService);
  private messageService = inject(MessageService);

  public titulo: string = 'Nova Tarefa';
  private tarefaId: number | null = null;

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

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.tarefaId = +idParam;
      this.titulo = 'Editar Tarefa';
      this.tarefaService.getTarefaById(this.tarefaId).subscribe(tarefa => {
        this.tarefaForm.patchValue(tarefa);
      });
    }
  }

    salvar() {
    if (this.tarefaForm.invalid) return;

    if (this.tarefaId) {
        const tarefaData = this.tarefaForm.getRawValue();
        this.tarefaService.updateTarefa(tarefaData as any).subscribe(() => {
        this.messageService.add({ severity: 'info', summary: 'Sucesso', detail: 'Tarefa atualizada!' });
        this.router.navigate(['/tarefas']);
        });
    } else {
        const formValue = this.tarefaForm.getRawValue();

        const novaTarefa = {
        descricao: formValue.descricao!,
        prioridade: Number(formValue.prioridade!),
        concluida: Boolean(formValue.concluida!)
        };

        this.tarefaService.addTarefa(novaTarefa).subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa adicionada!' });
            this.router.navigate(['/tarefas']);
        });
    }
    }

  cancelar() {
    this.router.navigate(['/tarefas']);
  }
}