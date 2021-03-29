import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PaymentComponent } from './payment/payment.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PayComponent } from './pay/pay.component';
import { RouterModule } from '@angular/router';
import { HelloComponent } from './hello/hello.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from 'src/routes';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './cart/cart.component';
import { PushNotificationsModule } from 'ng-push-ivy';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PaymentComponent,
    PayComponent,
    HelloComponent,
    NotFoundComponent,
    CartComponent
  ],
  imports: [
    BrowserModule,
    QRCodeModule,
    HttpClientModule,
    AppRoutingModule,
    PushNotificationsModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
