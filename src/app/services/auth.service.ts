import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { secret } from 'src/environments/secret';
import { Users, UsersResult, UsersVerify } from '../models/auth.model';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(`${secret.API_user}:${secret.API_pw}`)
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  
  /*
  | -------------------------------------------------------------------
  |  Create/update file secret.ts and secret.prod.ts in environments folder fill this code:
  |  export const secret = {
  |    AUTH_API: 'http://api.domain.com/',
  |    API_user: 'user',
  |    API_pw: 'pw'
  |  };
  */

  async login(email: string, password: string) {
    return (await firstValueFrom(this.http.get<UsersVerify>(`${secret.AUTH_API}password_verify?email=${email}&password=${password}`, httpOptions)));
  }

  async register(email: string, password: string) {
    return (await firstValueFrom(this.http.post(secret.AUTH_API, `email=${email}&password=${password}`, httpOptions)));
  }

  async getUsers(params: {param: string, value: any}) {
    return (await firstValueFrom(this.http.get<UsersResult>(`${secret.AUTH_API}?${params.param}=${params.value}`, httpOptions))).data;
  }
}
