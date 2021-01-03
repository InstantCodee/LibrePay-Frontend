import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentComponent } from './payment/payment.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PayComponent } from './pay/pay.component';
import { RouterModule } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/routes';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './dashboard/login/login.component';
import { FormsModule } from '@angular/forms';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { DashboardHeaderComponent } from './dashboard/header/header.component';

const config: SocketIoConfig = { url: 'http://localhost:2009', options: {} };

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
    DashboardHeaderComponent
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
