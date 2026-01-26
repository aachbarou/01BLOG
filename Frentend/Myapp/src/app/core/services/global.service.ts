import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'   
})
export class GlobalService {
//   appName = 'My Angular App';
  apiUrl = 'http://localhost:8080/api';
}
