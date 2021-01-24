import { getCurrencySymbol } from '@angular/common';
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
  method: CryptoUnits;
  amount: number;
  exRate: number;
}

export enum PaymentStatus {
  TOOLITTLE = -3,
  TOOLATE = -2,
  CANCELLED = -1,
  REQUESTED = 0,
  PENDING = 1,
  UNCONFIRMED = 2,
  DONE = 3,
  TOOMUCH = 4
}
export interface IInvoice {
  selector: string;
  paymentMethods: IPaymentMethod[];
  paymentMethod?: CryptoUnits;
  receiveAddress?: string;
  transcationHash?: string;
  confirmation?: number;
  cart?: ICart[];
  totalPrice?: number;
  currency: string;
  dueBy: Date;
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

  SERVER_URL = 'http://192.168.178.26:2009';

  // Fill with empty data
  invoice: IInvoice = {
    selector: '',
    paymentMethods: [],
    receiveAddress: '',
    currency: 'USD',
    dueBy: new Date(),
    successUrl: '',
    cancelUrl: ''
  };
  invoiceUpdate: BehaviorSubject<IInvoice | null>;

  // This value is s
  confirmations: number;

  constructor(
    private socket: Socket,
    private http: HttpClient
  ) {
    this.confirmations = 0;
    this.invoiceUpdate = new BehaviorSubject<IInvoice | null>(null);
    this.socket.on('status', (data: any) => {
      console.log('Status has been updated to: ', data);
      this.invoice.status = data;
      this.invoiceUpdate.next(this.invoice);
    });
    this.socket.on('subscribe', (success: boolean) => {
      if (success) { console.log('We\'re getting the progress of this invoice!'); }
      else { console.log('Subscribtion failed'); }
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  /**
   * Subscribe to the real-time status of the selected invoice.
   */
  subscribeTo(selector: string): void {
    this.socket.on('subscribe', (status: boolean) => {
      if (status) {
        this.updateInvoice();
        console.log('Successfully subscribed to this invoice');
      }
      else { console.log('Failed to subscribe'); }
    });

    this.socket.on('confirmationUpdate', (update: any) => {
      this.confirmations = update.count;
    });

    this.socket.emit('subscribe', { selector });
  }

  /**
   * This will update the current invoice
   */
  updateInvoice(): void {
    if (this.invoice !== undefined || this.invoice !== null) {
      this.setInvoice(this.invoice.selector);
    }
  }

  /**
   * This will set the current selected invoice by the `selector`.
   */
  setInvoice(selector: string): Promise<IInvoice> {
    return new Promise(async (resolve, reject) => {
      if (selector === undefined || selector === 'undefined' || selector === '') {
        reject('There is no selector. Please set one before calling setInvoice(...)');
        return;
      }

      this.http.get(this.SERVER_URL + '/invoice/' + selector, {
        observe: 'body',
        responseType: 'json'
      }).toPromise().then((invoice) => {
        this.invoice = invoice as IInvoice;
        resolve(this.invoice);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * This will notify the backend that the user just cancelled the payment.
   */
  cancelInvoice(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.invoice.selector === '') {
        reject('Cannot delete invoice with empty selector.');
        return;
      }

      this.http.delete(this.SERVER_URL + '/invoice/' + this.invoice.selector, {
        observe: 'body',
        responseType: 'json'
      }).toPromise().then((invoice) => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * This will set the payment method of the selected invoice.
   */
  setPaymentMethod(method: CryptoUnits): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.invoice === null) { reject('Invoice is not set!'); return; }

      this.http.post(`${this.SERVER_URL}/invoice/${this.invoice?.selector}/setmethod`, { method }, {
        responseType: 'json'
      }).toPromise().then(() => {
        this.setInvoice(this.invoice.selector);
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  currencyPrefix(): string {
    return getCurrencySymbol(this.invoice.currency, 'narrow');
  }

  /**
   * Can be used if the socket connection is broken or as initial call.
   */
  getConfirmation(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (this.invoice === null || this.invoice.status !== PaymentStatus.UNCONFIRMED) {
        reject('Invoice is not set!');
        return;
      }

      this.http.get(`${this.SERVER_URL}/invoice/${this.invoice.selector}/confirmation`, {
        observe: 'body',
        responseType: 'json'
      }).toPromise().then((res: any) => {
        this.confirmations = res.confirmation;
        this.invoiceUpdate.next(this.invoice);
        resolve(res.confirmation);
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * @returns Path to icon in assets folder
   */
  getIcon(unit?: CryptoUnits): string {
    if (unit === undefined) {
      if (this.invoice.paymentMethod === undefined) {
        return 'assets/Bitcoin.svg';
      }

      unit = this.invoice.paymentMethod;
    }
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

  findCryptoBySymbol(symbol?: string): string | null {
    if (symbol === undefined) {
      if (this.invoice.paymentMethod === undefined) {
        return null;
      }

      symbol = this.invoice.paymentMethod;
    }

    for (const coin in CryptoUnits) {
      // @ts-ignore: This actually works but I think it's too hacky for TS. Allow me this one, please.
      if (CryptoUnits[coin] === symbol.toUpperCase()) {
        return coin.charAt(0).toUpperCase() + coin.toLowerCase().slice(1);
      }
    }
    return null;
  }

  /**
   * @returns The price to pay by cryptocurrency;
   */
  getAmount(): string | undefined {
    const amount = this.invoice?.paymentMethods.find(item => {
      return item.method === this.invoice.paymentMethod;
    })?.amount.toString();

    if (amount === undefined) { return '0.00'; }

    return amount;
  }

  /**
   * Calculate the price in crypto of a specifc product.
   * @param prodcut Index of product in cart
   */
  calculateCryptoPrice(productNr: number): number {
    if (this.invoice.cart === undefined) { return 0; }
    if (this.invoice.paymentMethod === undefined) { return 0; }

    const product = this.invoice.cart[productNr];
    const exRate = this.invoice.paymentMethods.find(method => method.method === this.invoice.paymentMethod)?.exRate;
    if (exRate === undefined) { return 0; }

    return product.quantity * product.price / exRate;
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
        return 'Cancelled by user';
      case PaymentStatus.TOOLATE:
        return 'Expired';
      case PaymentStatus.TOOLITTLE:
        return 'Paid too little';
      case PaymentStatus.TOOMUCH:
        return 'Paid too much';
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
