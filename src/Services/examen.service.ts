import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Examen } from 'src/Models/Examen';
import { Question } from 'src/Models/Question';
import { Reponse } from 'src/Models/Reponse';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  private apiUrl = 'https://ihm-eta.vercel.app/api/api';
  private apicertif="https://ihm-eta.vercel.app/api/api/userscertificats"
  constructor(private http: HttpClient) {}

  getExamenBySession(sessionId: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.apiUrl}/formationSessions/${sessionId}/examen`);
  }

  getQuestionsByExamen(examenId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/examens/${examenId}/questions`);
  }

  getReponsesByQuestion(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/questions/${questionId}/reponses`);
  }

 
// Méthode pour calculer le score avec authentification
calculerScore(examenId: number, token: string, reponses: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  const body = {
    "reponses": reponses
  };
 // 'reponses':{
    //   "4":[13],
    //   "5":[17],
    //   "6":[21]
    // }


  return this.http.post(`${this.apiUrl}/examen/${examenId}/evaluer`, body, { headers });
}


 // Fonction pour récupérer les certificats de l'utilisateur
 getUserCertificats(token: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.get(this.apicertif, { headers });
}
}