import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BackendService, CryptoUnits } from '../backend.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentSelector = '';
  confirmations = 0;
  choosenPaymentMethod = CryptoUnits.BITCOIN;
  status: string;
  ready = false;

  constructor(
    public backend: BackendService,
    private route: ActivatedRoute
  ) {
    this.status = this.backend.getStatus();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paymentSelector = params.id;
      this.backend.subscribeTo(this.paymentSelector);
      this.get();
    });

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
