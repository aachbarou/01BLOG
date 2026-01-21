import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { ApiResponse } from "../models/api-response.model";

// الواجهات البرمجية المطلوبة (Interfaces)
export interface UserAuthor {
  id: number;
  name: string;
  avatarUrl: string;
}

export interface UserProfile extends UserAuthor {
  bio: string;
  isOwnProfile: boolean;
  isFollowing: boolean;
  stats: {
    posts: any[];
    followers: number;
    following: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}` ).set('Content-Type', 'application/json');
  }

  loadCurrentUser(): void {
    this.http.get<ApiResponse<any>>(`${this.baseUrl}/me`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => {
          this.currentUserSubject.next(res.data);
        },
        error: (err) => console.error('Could not load current user', err)
      });
  }

  getUserProfile(id?: number): Observable<ApiResponse<any>> {
    if  (!id &&  this.currentUserSubject.value) {
      id = this.currentUserSubject.value.id;
    }
    const url =   `${this.baseUrl}/${id}`  ;
    return this.http.get<ApiResponse<any>>(url, { headers: this.getHeaders() }).pipe(
      tap(res => {
        if (!id || res.data.isOwnProfile) {
            this.currentUserSubject.next(res.data);
        }
      })
    );
  }

  toggleFollow(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/follow`, {}, { headers: this.getHeaders() });
  }

  updateProfile(updateData: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/update`, updateData, { headers: this.getHeaders() }).pipe(
      tap(() => {
        this.loadCurrentUser();
      })
    );
  }

  clearState(): void {
    this.currentUserSubject.next(null);
  }
}