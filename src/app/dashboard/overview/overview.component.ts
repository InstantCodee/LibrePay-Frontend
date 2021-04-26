import {Component, OnInit} from '@angular/core';
import {DashboardService} from 'src/app/dashboard.service';
import {HttpClient} from '@angular/common/http';
import {BackendService} from '../../backend.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(
    private dashboard: DashboardService,
    private backend: BackendService
  ) {
  }

  ngOnInit(): void {

  }


}
