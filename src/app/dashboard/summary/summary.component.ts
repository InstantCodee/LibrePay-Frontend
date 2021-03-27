import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  
  summary = 1;

  dates = [
      { id: 1, name: 'Today' },
      { id: 2, name: 'Last 3 days' },
      { id: 3, name: 'One month' },
      { id: 4, name: 'Last 3 months' },
      { id: 5, name: 'One year' },
      { id: 6, name: 'Last 3 years' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
