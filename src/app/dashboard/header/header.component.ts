import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class DashboardHeaderComponent implements OnInit {

  constructor(
    public dashboard: DashboardService,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

}
