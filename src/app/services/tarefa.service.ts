import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
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

    addTarefa(novaTarefa: Omit<Tarefa, 'id'>): Observable<Tarefa> {
        return this.http.post<Tarefa>(this.API_URL, novaTarefa);
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
