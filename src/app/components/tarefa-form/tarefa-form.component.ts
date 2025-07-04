import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Tarefa } from '../../models/tarefa';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
    selector: 'app-tarefa-form',
    imports: [
        ReactiveFormsModule, DialogModule, 
        ButtonModule, InputTextModule, 
        DropdownModule, ToggleButtonModule
    ],
    templateUrl: './tarefa-form.component.html',
    styleUrl: './tarefa-form.component.css'
})
export class TarefaFormComponent implements OnChanges {
    @Input() tarefa: Tarefa | null = null;
    @Input() visible: boolean = false;
  
    @Output() onSave = new EventEmitter<Omit<Tarefa, 'id'> | Tarefa>();
    @Output() onCancel = new EventEmitter<void>();
  
    private fb = inject(FormBuilder);
  
    public tituloDialog: string = 'Nova Tarefa';
  
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
  
    ngOnChanges(changes: SimpleChanges): void {
      if (changes['tarefa'] && this.tarefa) {
        this.tituloDialog = 'Editar Tarefa';
        this.tarefaForm.patchValue(this.tarefa);
      } else {
        this.tituloDialog = 'Nova Tarefa';
        this.tarefaForm.reset({ prioridade: 1, concluida: false });
      }
    }
  
    salvar() {
        if (this.tarefaForm.invalid) {
            return;
        }
    
        const tarefaParaSalvar = {
            id: this.tarefaForm.value.id,
            descricao: this.tarefaForm.value.descricao!,
            prioridade: this.tarefaForm.value.prioridade!,
            concluida: this.tarefaForm.value.concluida!
        };
    
        this.onSave.emit(tarefaParaSalvar);
    }
  
    cancelar() {
      this.onCancel.emit();
    }
}
