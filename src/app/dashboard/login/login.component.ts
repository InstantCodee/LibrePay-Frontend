import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';

  constructor(
    public dashboard: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  login() {
    const loginStatus = this.dashboard.login(this.username, this.password);

    if (loginStatus) {
      this.router.navigate(['dashboard', 'overview']);
    } else {
      // TODO: Meldung anzeigen
    }
  }

}