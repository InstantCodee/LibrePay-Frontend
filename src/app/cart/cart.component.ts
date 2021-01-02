import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    public backend: BackendService,
    public state: StateService
  ) { }

  ngOnInit(): void {
  }

}
