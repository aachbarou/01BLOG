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
  constructor(private http: HttpClient) {}
  getProfile(): Observable<ApiResponse<any>> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<ApiResponse<any>>('http://localhost:8080/api/users/me', { headers });
  }
    
}