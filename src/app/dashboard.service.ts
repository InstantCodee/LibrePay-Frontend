import { Injectable } from '@angular/core';

export interface IUser {
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  user: IUser | undefined;

  constructor() { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password') {
      this.user = {
        username: 'admin',
        token: 'abc'
      }
      return true;
    } else {
      return false;
    }
  }
}
