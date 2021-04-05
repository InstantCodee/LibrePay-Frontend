import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BackendService} from './backend.service';

export interface IUser {
  username: string;
  token: string;
}

export interface ISearchResponse {
  status: number;
  _id: string;
  selector: string;
  currency: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  receiveAddress: string;
  transcationHash: string;
}

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  user: IUser | undefined;

  constructor(
    private http: HttpClient,
    private backend: BackendService
  ) {}

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password') {
      this.user = {
        username: 'admin',
        token: 'abc'
      };
      return true;
    } else {
      return false;
    }
  }

  getInvoices(): void {
    // const headers = new HttpHeaders({ token: this.backend.token });
    this.http.get('http://localhost:2009/invoice', {
      observe: 'body',
      responseType: 'json'
    }).toPromise().then(res => {
      console.log('Data:', res);
    });
  }

}
