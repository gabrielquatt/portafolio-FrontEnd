import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { User } from '../Model/User';
import { Router } from '@angular/router';
// import swal from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authenticate= false;
  user: User;

  constructor(private authService: AuthService,private router: Router ) {
    this.user = new User();
   }

   LoginForm():void{
    if(this.user.userName == "" || this.user.password == ""){
      Swal.fire('Error Login', 'Usuario o Contraseña vacios!','error')
      return;
    }
      
    this.authService.login(this.user).subscribe(response=>{  
        if(sessionStorage.getItem('usuario') !== null){
          Swal.fire({
            title:'Error Login',
            icon:'info',
            text: `Hola ${this.authService.user.userName}, ya estas autenticado!`,
            background: '#212422',
          })
        }
        console.log(response.token);
        this.authService.guardarToken(response.token);
        this.authService.guardarUsuario(response.token);
        let usuario = this.authService.user;
        this.router.navigate(['/home']);
        Swal.fire({
          title:'Login',
          text: `Hola ${usuario.userName}, has iniciado sesión con éxito!`,
          icon: 'success',
          background: '#212422',
          color: '#63E060'
        })
        // Swal.fire('Login',  `Hola ${usuario.userName}, has iniciado sesión con éxito!`, 'success')
      },err =>{
        if(err.status == 400){
          Swal.fire({
            title:'Error Login',
            text:  'Usuario o Contraseña Incorrecta',
            icon: 'error',
            background: '#212422',
            color: '#63E060'
          })
          // Swal.fire('Error Login', 'Usuario o Contraseña Incorrecta','error')
        }
      })
  }



  
  active() : boolean {
    return this.authService.isAuthenticated();
  }
  
  ngOnInit(): void {
     if(this.authService.isAuthenticated()){
      Swal.fire('Error Login', `Hola ${this.authService.user.userName}, ya estas autenticado!`,'info')
       this.router.navigate(['/home']);
     }
  }

}
