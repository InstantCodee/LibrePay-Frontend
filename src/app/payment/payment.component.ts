import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PushNotificationsService } from 'ng-push-ivy';

import { BackendService, CryptoUnits, PaymentStatus } from '../backend.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentSelector = '';
  confirmations = 0;
  status: string;
  ready = false;
  emittedNotification = false;

  // XYZ class (will be xyz-out if cart is shown for example)
  xyzClass: string;
  hideMain: boolean;

  constructor(
    public backend: BackendService,
    public state: StateService,
    private route: ActivatedRoute,
    private push: PushNotificationsService
  ) {
    this.status = this.backend.getStatus();
    this.hideMain = false;
    this.xyzClass = 'xyz-in';
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paymentSelector = params.id;
      this.backend.subscribeTo(this.paymentSelector);
      this.get();
    });

    this.state.showCart.subscribe(cartStatus => {
      if (cartStatus) {
        this.xyzClass = 'xyz-out';
        setTimeout(() => {
          this.hideMain = true;
        }, 700);
      } else {
        setTimeout(() => {
          this.hideMain = false;
          this.xyzClass = 'xyz-in';
        }, 600);
      }
    });

    this.backend.invoiceUpdate.subscribe(newInvoice => {
      if (newInvoice?.status === PaymentStatus.UNCONFIRMED) {
        this.push.requestPermission();
      }
      if (newInvoice?.status === PaymentStatus.DONE) {
        if (this.emittedNotification) { return; }
        this.push.create('Transaction confirmed!', {
          body: 'Your transaction just got confirmed.',
          lang: 'en',
          icon: this.backend.getIcon(),
          sticky: true,
          vibrate: [250, 400, 250],
          sound: 'assets/pay_success.mp3'
        }).subscribe(
          (res: any) => {
            console.log('Success');
          },
          (err: any) => {
            console.error('Error:', err);
          }
        );
        this.emittedNotification = true;
      }
      this.status = this.backend.getStatus();
    });
  }

  chooseMethod(coin: CryptoUnits): void {
    this.backend.setPaymentMethod(coin);
  }

  getReceiveAddress(): string {
    const address = this.backend.invoice.receiveAddress;
    if (address === undefined) {
      return '';
    }

    if (address.length > 35) {
      return address.slice(0, -(address.length - 35)) + '...';
    }

    return address;
  }

  async get(): Promise<void> {
    const res = await this.backend.setInvoice(this.paymentSelector);
    this.status = this.backend.getStatus();
    this.backend.getConfirmation().catch();
    this.ready = true;
  }

}
