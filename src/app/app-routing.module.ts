import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageHomeComponent } from './page-home/page-home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', 
    component: PageHomeComponent
   },
  { path: 'home', 
  component: PageHomeComponent }
  ,
  { path: 'login',
   component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
