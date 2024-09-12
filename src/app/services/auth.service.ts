import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {jwtDecode} from "jwt-decode";
import {AppStateService} from "./app-state.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private appState:AppStateService) { }

  async login(username: string, password: string): Promise<boolean> {
    try {
      let user: any = await firstValueFrom(this.http.get(`http://localhost:3000/users/${username}`));

      if (btoa(password) === user.password) {
        let token = user.token;
        let decodedJWT: any = jwtDecode(token);

        this.appState.setAuthState({
          isAuthenticated: true,
          username: username,
          roles: decodedJWT.roles,
          token: token
        });

        return Promise.resolve(true);
      } else {
        return Promise.reject("Bad credentials");
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return Promise.reject("Bad credentials");
      } else {
        console.error('Error during login:', error);
        return Promise.reject("An error occurred. Please try again later.");
      }
    }
  }
}
