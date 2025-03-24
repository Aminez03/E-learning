// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const API_URL = "https://ihm-eta.vercel.app/api/api/users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private userRole: string = localStorage.getItem("role") || '';
  constructor(private http: HttpClient) {
    const user = localStorage.getItem("CC_Token");
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // Register a user
  signup(user: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Login a user
  signin(user: any) {
    return this.http.post<any>(`${API_URL}/login`, user);
  }

  // Logout a user
  logout() {
    const token = localStorage.getItem('CC_Token'); 
    if (!token) {
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${API_URL}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.clear();
        this.currentUserSubject.next(null);
      })
    );
  }

  // Get user profile
  profile() {
    const token = localStorage.getItem("CC_Token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${API_URL}/user-profile`, { headers });
  }


  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
  isUser(): boolean {
    return this.userRole === 'user';
  }



}
