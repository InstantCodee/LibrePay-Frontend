import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

/*
 * The following interfaces are copied from the backend.
 * 
 * Checkout src/helper/types.ts and src/models/invoice/invoice.interface.ts
 * (in the backend repository) for more information.
 */
export enum CryptoUnits {
  BITCOIN = 'BTC',
  BITCOINCASH = 'BCH',
  ETHEREUM = 'ETH',
  LITECOIN = 'LTC',
  DOGECOIN = 'DOGE',
  MONERO = 'XMR'
}

export interface ICart {
  price: number;
  name: string;
  image: string;
  quantity: number;
}

export interface IPaymentMethod {
  method: any;
  amount: number
}

export enum PaymentStatus {
  PENDING = 0,
  PARTIALLY = 1,
  UNCONFIRMED = 2,
  DONE = 3,
  CANCELLED = 4
}

export interface IInvoice {
  selector: string;
  paymentMethods: IPaymentMethod[];
  receiveAddress: string;
  paidWith?: CryptoUnits;
  paid?: number;
  transcationHashes?: string[];
  cart?: ICart[];
  totalPrice?: number;
  currency: string;
  dueBy: number;
  status?: PaymentStatus;
  email?: string;
  successUrl: string;
  cancelUrl: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  SERVER_URL = 'http://localhost:2009';

  constructor(
    private socket: Socket,
    private http: HttpClient
  ) {
    this.socket.on('status', (data: any) => {
      console.log('Status has been updated to: ', data);
    });
    this.socket.on('subscribe', (success: boolean) => {
      if (success) { console.log('We\'re getting the progress of this invoice!'); }
      else { console.log('Subscription failed'); }
    });
  }

  subscribeTo(selector: string) {
    this.socket.emit('subscribe', { selector });
  }

  getInvoice(selector: string): Promise<IInvoice> {
    return new Promise(async (resolve, reject) => {
      this.http.get(this.SERVER_URL + '/invoice/' + selector, {
        observe: 'body',
        responseType: 'json'
      }).toPromise().then((invoice) => {
        resolve(invoice as IInvoice);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
