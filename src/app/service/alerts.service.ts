import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor( private authService: AuthService,private router: Router,) { }

  public alert403(){
    swal.fire({ //Acceso Denegado
      title:'Acceso Denegado',
      text: `¡no tienes permisos para realizar esa accion!`,
      icon: 'error',
      background: '#212422',
      color: '#d80a0a'
    });
    this.authService.reload();
  }

  public alert401(){
    swal.fire({ // No Autenticado
      title:'Error',
      text: `¡no autenticado!`,
      icon: 'error',
      background: '#212422',
      color: '#d80a0a'
    });
    this.authService.reload();
  }

  //---------------- Alerts -----------------

  public alertNoAuth(){
    swal.fire({ //no se encuentra autenticado
      title:'Sesion Terminada',
      text: `no se encuentra autenticado`,
      icon: 'info',
      background: '#212422',
      color: '#ddda32'
  });
  this.authService.reload();
  }

  public alertYaAuth(){
    swal.fire({
      title:'¡Alerta!',
      text: `Hola ${this.authService.user.userName}, ya estas autenticado!`,
      icon:'info',
      background: '#212422',
      color: '#ddda32'
    })
  }

  public alertLoginError(){
    swal.fire({
      title:'Error Login',
      text:  'Usuario o Contraseña Incorrecta',
      icon: 'error',
      background: '#212422',
      color: '#d80a0a'
    })
  }

  public alertLoginSuccess(name: String){
    swal.fire({
      title:'Login',
      text: `Hola ${name}, has iniciado sesión con éxito!`,
      icon: 'success',
      background: '#212422',
      color: '#72b626'
    })
  }

  public alertLogout(){
    swal.fire({
      title:'Logout',
      text: '¡Has cerrado sesión con exito!',
      icon: 'success',
      background: '#212422',
      color: '#72b626'
    })
    this.router.navigate(['/login']);
  }

  public alertCampVacios(){
    swal.fire({ //¡No Puede Dejar Campos Vacios!
      title:'Error Campos Vacios',
      text: `¡No Puede Dejar Campos Vacios!`,
      icon: 'info',
      background: '#212422',
      color: '#ddda32'
  });
  } 

  // ---------- Images --------------

  public alertCampVaciosImg(){
    swal.fire({ //¡No Puede Dejar Campos Vacios img!
      title:'Error Debe Seleccionar una Imagen',
      text: 'Debe seleccionar una foto',
      icon: 'info',
      background: '#212422',
      color: '#ddda32'
  });
  }

  public alertSaveImgSuccess(){
    swal.fire({ //¡Finalizado!
      title:'¡Finalizado!',
      text: 'Debe seleccionar una foto',
      icon: 'success',
      background: '#212422',
      color: '#72b626'
  });
  }

 
}
