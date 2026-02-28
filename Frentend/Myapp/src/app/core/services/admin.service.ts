import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AdminUser, AdminPost, Report } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class AdminService {

    private apiUrl = 'http://localhost:8080/api/admin';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders()
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');
    }

    // ── Users ──
    getUsers(): Observable<ApiResponse<AdminUser[]>> {
        return this.http.get<ApiResponse<AdminUser[]>>(
            `${this.apiUrl}/users`, { headers: this.getHeaders() }
        );
    }

    banUser(id: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.apiUrl}/users/${id}/ban`, {}, { headers: this.getHeaders() }
        );
    }

    deleteUser(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.apiUrl}/users/${id}`, { headers: this.getHeaders() }
        );
    }

    // ── Posts ──
    getPosts(): Observable<ApiResponse<AdminPost[]>> {
        return this.http.get<ApiResponse<AdminPost[]>>(
            `${this.apiUrl}/posts`, { headers: this.getHeaders() }
        );
    }

    deletePost(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.apiUrl}/posts/${id}`, { headers: this.getHeaders() }
        );
    }

    changePostStatus(id: number, status: string): Observable<ApiResponse<any>> {
        return this.http.put<ApiResponse<any>>(
            `${this.apiUrl}/posts/${id}/status?status=${status}`, {}, { headers: this.getHeaders() }
        );
    }

    // ── Reports ──
    getReports(): Observable<ApiResponse<Report[]>> {
        return this.http.get<ApiResponse<Report[]>>(
            `${this.apiUrl}/reports`, { headers: this.getHeaders() }
        );
    }

    resolveReport(id: number): Observable<ApiResponse<any>> {
        return this.http.delete<ApiResponse<any>>(
            `${this.apiUrl}/reports/${id}`, { headers: this.getHeaders() }
        );
    }
}
