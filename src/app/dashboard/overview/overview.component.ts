import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    if (this.dashboard.user === undefined) {
      this.dashboard.login('admin', 'password');
    }
  }

}
