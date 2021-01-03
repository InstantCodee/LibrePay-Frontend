import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./app/dashboard/dashboard.component";
import { LoginComponent } from "./app/dashboard/login/login.component";
import { OverviewComponent } from "./app/dashboard/overview/overview.component";
import { HelloComponent } from "./app/hello/hello.component";
import { NotFoundComponent } from "./app/not-found/not-found.component";
import { PayComponent } from "./app/pay/pay.component";

const routes: Routes = [
    { path: 'pay/:id', component: PayComponent, data: { title: 'Payment' } },
    { path: 'dashboard', component: DashboardComponent, children: [
        {
            path: 'login', component: LoginComponent
        },
        {
            path: 'overview', component: OverviewComponent 
        }
    ]},
    { path: '', component: HelloComponent },
    { path: '**', component: NotFoundComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}