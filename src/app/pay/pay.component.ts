import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { StateService } from '../state.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {

  constructor(
    public backend: BackendService,
    public state: StateService
  ) { }

  ngOnInit(): void {
  }

}
