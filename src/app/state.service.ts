import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackendService, PaymentStatus } from './backend.service';

@Injectable({
  providedIn: 'root'
})
/**
 * The state service is responsible to exchange data between components.
 */
export class StateService {

  showCart: BehaviorSubject<boolean>;

  constructor(private backend: BackendService) {
    this.showCart = new BehaviorSubject<boolean>(false);
    
    this.backend.invoiceUpdate.subscribe(invoice => {
      this.showCart.next(false);  // Hide cart if status changes
    });
  }

  toggleCart() {
    this.showCart.next(!this.showCart.value);
  }
}
