import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentComponent } from './payment/payment.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PayComponent } from './pay/pay.component';
import { HelloComponent } from './hello/hello.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/routes';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { PushNotificationsModule } from 'ng-push-ivy';
import { ClipboardModule } from 'ngx-clipboard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './dashboard/login/login.component';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { DashboardHeaderComponent } from './dashboard/header/header.component';
import { ChartComponent } from './dashboard/chart/chart.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaymentComponent,
    PayComponent,
    HelloComponent,
    NotFoundComponent,
    CartComponent,
    DashboardComponent,
    LoginComponent,
    OverviewComponent,
    DashboardHeaderComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    PushNotificationsModule,
    ClipboardModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
