import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { Tarefa } from '../models/tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

    constructor() { }

    private readonly API_URL = '/api/tarefas'
    
    private http = inject(HttpClient);

    getTarefas(): Observable<Tarefa[]> {
        return this.http.get<Tarefa[]>(this.API_URL);
    }

    addTarefa(novaTarefaData: Omit<Tarefa, 'id'>): Observable<Tarefa> {
        return this.getTarefas().pipe(
            map(tarefas => {
                const maxId = tarefas.reduce((max, t) => t.id > max ? t.id : max, 0);

                const novaTarefaComId: Tarefa = {
                    ...novaTarefaData,
                    id: maxId + 1
                };
                return novaTarefaComId;
            }),
            switchMap(tarefaParaSalvar => {
                return this.http.post<Tarefa>(this.API_URL, tarefaParaSalvar);
            })
        );
    }

    updateTarefa(tarefaAtualizada: Tarefa): Observable<Tarefa> {
        return this.http.put<Tarefa>(`${this.API_URL}/${tarefaAtualizada.id}`, tarefaAtualizada);
    }

    deleteTarefa(id: number): Observable<object> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    getTarefaById(id: number): Observable<Tarefa> {
        return this.http.get<Tarefa>(`${this.API_URL}/${id}`);
    }
}
