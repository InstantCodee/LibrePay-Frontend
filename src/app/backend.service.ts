import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject } from 'rxjs';

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
  amount: number;
}

export enum PaymentStatus {
  CANCELLED = -2,
  REQUESTED = -1,
  PENDING = 0,
  UNCONFIRMED = 1,
  DONE = 2,
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

  invoice: IInvoice | null = null;
  invoiceUpdate: BehaviorSubject<IInvoice | null>;

  constructor(
    private socket: Socket,
    private http: HttpClient
  ) {
    this.invoiceUpdate = new BehaviorSubject<IInvoice | null>(null);
    this.socket.on('status', (data: any) => {
      console.log('Status has been updated to: ', data);
    });
    this.socket.on('subscribe', (success: boolean) => {
      if (success) { console.log('We\'re getting the progress of this invoice!'); }
      else { console.log('Subscribtion failed'); }
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  subscribeTo(selector: string): void {
    this.socket.on('subscribe', (status: boolean) => {
      if (status) {
        this.updateInvoice();
        console.log('Successfully subscribed to this invoice');
      }
      else { console.log('Failed to subscribe'); }
    });

    this.socket.emit('subscribe', { selector });
  }

  updateInvoice(): void {
    if (this.invoice !== undefined || this.invoice !== null) {
      this.setInvoice(this.invoice?.selector!);
    }
  }

  setInvoice(selector: string): Promise<IInvoice> {
    return new Promise(async (resolve, reject) => {
      this.http.get(this.SERVER_URL + '/invoice/' + selector, {
        observe: 'body',
        responseType: 'json'
      }).toPromise().then((invoice) => {
        this.invoice = invoice as IInvoice;
        this.invoiceUpdate.next(this.invoice);
        resolve(this.invoice);
      }).catch(err => {
        reject(err);
      });
    });
  }

  setPaymentMethod(method: CryptoUnits): Promise<void> {
    return new Promise(async (resolve, reject) => {
      this.http.post(`${this.SERVER_URL}/invoice/${this.invoice?.selector}/setmethod`, { method }, {
        responseType: 'json'
      }).toPromise().then(() => {
        this.setInvoice(this.invoice!!.selector);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * @returns Path to icon
   */
  getIcon(unit: CryptoUnits): string {
    switch (unit) {
      case CryptoUnits.BITCOIN:
        return 'assets/Bitcoin.svg';
      case CryptoUnits.BITCOINCASH:
        return 'assets/BitcoinCash.svg';
      case CryptoUnits.DOGECOIN:
        return 'assets/Dogecoin.png';
      case CryptoUnits.ETHEREUM:
        return 'assets/Ethereum.svg';
      case CryptoUnits.LITECOIN:
        return 'assets/Litecoin.svg';
      case CryptoUnits.MONERO:
        return 'assets/Monero.svg';
    }
  }

  findCryptoBySymbol(symbol: string): string | null {
    for (const coin in CryptoUnits) {
      // @ts-ignore: This actually works but I thing it's too hacky for TS. Allow me this one, please?
      if (CryptoUnits[coin] === symbol.toUpperCase()) {
        return coin.charAt(0).toUpperCase() + coin.toLowerCase().slice(1);
      }
    }
    return null;
  }

  getAmount(): string | undefined {
    return this.invoice?.paymentMethods.find(item => {
      return item.method === CryptoUnits.BITCOIN;
    })?.amount.toFixed(8);
  }

  getStatus(): string {
    switch (this.invoice?.status) {
      case PaymentStatus.PENDING:
        return 'Pending';
      case PaymentStatus.UNCONFIRMED:
        return 'Unconfirmed';
      case PaymentStatus.DONE:
        return 'Paid';
      case PaymentStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  isInvoiceDone(): boolean {
    return this.invoice?.status === PaymentStatus.DONE;
  }

  isInvoicePending(): boolean {
    return this.invoice?.status === PaymentStatus.PENDING;
  }

  isInvoiceRequested(): boolean {
    return this.invoice?.status === PaymentStatus.REQUESTED;
  }
}
