import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from 'src/Models/Question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/questions';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  getById(id: number): Observable<Question> {
    return this.http.get<Question>(`${this.apiUrl}/${id}`);
  }

  create(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question);
  }

  update(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}