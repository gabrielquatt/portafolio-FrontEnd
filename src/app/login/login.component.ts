import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../Model/User';
import { Router } from '@angular/router';
import { AlertsService } from '../service/alerts.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authenticate= false;
  user: User;

  constructor
  (private authService: AuthService,
    private router: Router,
    private alert:AlertsService, ) {
    this.user = new User();
   }

   LoginForm():void{
    if(this.user.userName == "" || this.user.password == ""){
      this.alert.alertLoginError();
      return;
    }
      
    this.authService.login(this.user).subscribe(response=>{  
        if(sessionStorage.getItem('usuario') !== null){
          this.alert.alertYaAuth();
        }
        console.log(response.token);
        this.authService.guardarToken(response.token);
        this.authService.guardarUsuario(response.token);
        let usuario = this.authService.user;
        this.router.navigate(['/home']);
        this.alert.alertLoginSuccess(usuario.userName);
      },err =>{
        if(err.status == 400){
         this.alert.alertLoginError();
        }
      })
  }


  active() : boolean {
    return this.authService.isAuthenticated();
  }
  
  ngOnInit(): void {
     if(this.authService.isAuthenticated()){
      this.authService.user.userName
      this.alert.alertLoginSuccess(this.authService.user.userName);
      this.router.navigate(['/home']);
     }
  }

}
