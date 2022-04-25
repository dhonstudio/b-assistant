import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${environment.API_user}:${environment.API_pw}`)
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  login(username: string, password: string): Observable<any> {
    return this.http.post(environment.AUTH_API + 'signin', {
      username,
      password
    }, httpOptions);
  }

  async register(email: string, password: string) {
    return (await firstValueFrom(this.http.post(environment.AUTH_API, `email=${email}&password=${password}`, httpOptions)));
  }
}
