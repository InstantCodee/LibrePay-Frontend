import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService, IInvoice, CryptoUnits, PaymentStatus, IPaymentMethod } from '../backend.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentSelector = '';
  choosenPaymentMethod = CryptoUnits.BITCOIN;
  ready = false;

  constructor(
    public backend: BackendService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paymentSelector = params.id;
      this.backend.subscribeTo(this.paymentSelector);
      this.get();
    });
  }

  chooseMethod(coin: CryptoUnits) {
    this.backend.setPaymentMethod(coin);
  }

  async get(): Promise<void> {
    await this.backend.setInvoice(this.paymentSelector);
    this.ready = true;
  }

}
