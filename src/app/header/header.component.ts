import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  startCancelling = false;
  cancelProgress = 0;
  cancelProgressStyle = "";  // This is the style of the cancel button

  constructor(
    public backend: BackendService,
    public state: StateService
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    if (!this.startCancelling) {
      this.startCancelling = true;
      const animation = setInterval(() => {
        this.cancelProgress += 0.5;
        this.cancelProgressStyle = `
        background-image: linear-gradient(90deg, rgba(255,120,120,0.3) ${this.cancelProgress.toFixed(1)}%, rgba(255,255,255,0) ${this.cancelProgress.toFixed(1)}%);
        margin-left: 16px;
        transform: scale(1.1);
        `;

        if (this.cancelProgress > 100) {
          clearInterval(animation);
          this.startCancelling = false;
          this.cancelProgress = 0;
          this.cancelProgressStyle = '';
        }
      }, 15);
      return;
    }

    this.backend.cancelInvoice();
  }

  gotoMerchant() {
    window.location.href = this.backend.invoice.redirectTo;
  }

}
