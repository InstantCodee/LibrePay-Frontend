import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from 'src/app/dashboard.service';
import {BackendService} from '../../backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    public dashboard: DashboardService,
    private router: Router,
    private backend: BackendService
  ) {
  }


  async login(): Promise<void> {

    const loginStatus = await this.backend.login(this.username, this.password);
    if (loginStatus) {
      this.router.navigate(['dashboard', 'overview']);
    } else {
      // TODO: Meldung anzeigen
    }

    if (loginStatus) {
      this.router.navigate(['dashboard', 'overview']);
    } else {
      // TODO: Meldung anzeigen
    }
  }

}
