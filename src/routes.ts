import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HelloComponent } from "./app/hello/hello.component";
import { NotFoundComponent } from "./app/not-found/not-found.component";
import { PayComponent } from "./app/pay/pay.component";

const routes: Routes = [
    { path: 'pay/:id', component: PayComponent, data: { title: 'Payment' } },
    { path: '', component: HelloComponent },
    { path: '**', component: NotFoundComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}