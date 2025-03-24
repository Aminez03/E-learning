import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificat } from 'src/Models/Certificat';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'http://localhost:3000/certificats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(this.apiUrl);
  }

  getById(id: number): Observable<Certificat> {
    return this.http.get<Certificat>(`${this.apiUrl}/${id}`);
  }

  create(certificat: Certificat): Observable<Certificat> {
    return this.http.post<Certificat>(this.apiUrl, certificat);
  }

  update(id: number, certificat: Certificat): Observable<Certificat> {
    return this.http.put<Certificat>(`${this.apiUrl}/${id}`, certificat);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
