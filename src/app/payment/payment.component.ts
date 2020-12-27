import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendService, IInvoice, CryptoUnits, PaymentStatus } from '../backend.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentSelector = '';
  choosenPaymentMethod = CryptoUnits.BITCOIN;
  ready = false;
  invoice: IInvoice | null = null;

  constructor(
    private backend: BackendService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.paymentSelector = params.id;
      this.backend.subscribeTo(this.paymentSelector);
      this.get();
    });
  }

  async get() {
    this.invoice = await this.backend.getInvoice(this.paymentSelector);
    this.ready = true;
  }

  getAmount() {
    return this.invoice?.paymentMethods.find(item => {
      return item.method === CryptoUnits.BITCOIN;
    })?.amount.toFixed(8);
  }

  getStatus() {
    switch (this.invoice?.status) {
      case PaymentStatus.PENDING:
        return 'Pending';
      case PaymentStatus.PARTIALLY:
        return 'Partly';
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

}
