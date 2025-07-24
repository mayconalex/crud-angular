// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TarefaListComponent } from './components/tarefa-list/tarefa-list.component';
import { TarefaFormComponent } from './components/tarefa-form/tarefa-form.component';

export const routes: Routes = [
    { path: 'tarefas', component: TarefaListComponent },
    { path: 'tarefas/nova', component: TarefaFormComponent },
    { path: 'tarefas/editar/:id', component: TarefaFormComponent },
    { path: '', redirectTo: '/tarefas', pathMatch: 'full' },
];