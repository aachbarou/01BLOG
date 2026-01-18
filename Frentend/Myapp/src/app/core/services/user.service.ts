import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface UserAuthor {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface UserProfile extends UserAuthor {
  bio: string;
  joinDate: Date;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}
@Injectable({
    providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(id?: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const url = id ? `${this.baseUrl}/${id}` : `${this.baseUrl}/me`;
    return this.http.get<ApiResponse<any>>(url, { headers });
  }
  
  toggleFollow(id: number): Observable<ApiResponse<any>> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/follow`, {}, { headers });
  }
    
}