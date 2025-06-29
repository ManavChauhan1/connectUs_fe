import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private BASE_URL = 'http://localhost:3000'; // backend URL

  constructor(private http: HttpClient) {}

  //Generating Headers
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/login`, data);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/profile`, { headers: this.getAuthHeaders() });
  }

  logout(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/logout`, { headers: this.getAuthHeaders() });
  }

  createPost(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/post`, data, { headers: this.getAuthHeaders() });
  }

  getPostById(id: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/edit/${id}`, { headers: this.getAuthHeaders() });
  }

  updatePost(id: string, data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}/update/${id}`, data, { headers: this.getAuthHeaders() });
  }

  uploadProfilePic(data: FormData): Observable<any> {
    return this.http.post<{ filename: string}>(
      `${this.BASE_URL}/upload`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  likePost(id: string): Observable<any> {
    return this.http.patch(
      `${this.BASE_URL}/${id}/like`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  //Getting Feeds
  getFeed(): Observable<any>{
    return this.http.get(`${this.BASE_URL}/feed`, {
      headers: this.getAuthHeaders()
    });
  }

  //Delete Profile
  deleteProfile(): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.delete(`${this.BASE_URL}/delete`, { headers });
  }

  checkAuth() {
    return this.http.get(`${this.BASE_URL}/profile`, { headers: this.getAuthHeaders() });
  }
}
