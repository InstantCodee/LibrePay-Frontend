import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackendService, CryptoUnits } from '../backend.service';
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

  // XYZ class (will be xyz-out if cart is shown for example)
  xyzClass: string;
  hideMain: boolean;

  constructor(
    public backend: BackendService,
    public state: StateService,
    private route: ActivatedRoute
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
    })

    this.backend.invoiceUpdate.subscribe(newInvoice => {
      this.status = this.backend.getStatus();
    });
  }

  chooseMethod(coin: CryptoUnits): void {
    this.backend.setPaymentMethod(coin);
  }

  async get(): Promise<void> {
    await this.backend.setInvoice(this.paymentSelector);
    this.backend.getConfirmation().catch();
    this.ready = true;
  }

}
