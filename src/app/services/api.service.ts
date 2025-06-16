import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:3000';  // Change if your backend URL differs

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, data, { withCredentials: true });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data, { withCredentials: true });
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/profile`, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/logout`, { withCredentials: true });
  }

  createPost(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/post`, data, { withCredentials: true });
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/edit/${id}`, { withCredentials: true });
  }

  updatePost(id: string, data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/update/${id}`, data, { withCredentials: true });
  }

  uploadProfilePic(data: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL}/upload`, data, { withCredentials: true });
  }

  likePost(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/like/${id}`, { withCredentials: true });
  }

  checkAuth() {
    return this.http.get(`${this.BASE_URL}/profile`, { withCredentials: true });
  }
}
