import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { User } from '../Model/User';
import jwt_decode from 'jwt-decode';
import swal from 'sweetalert2';


const urlEndpoint = "/api/auth/";


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private _user!: User;
  private _token!: string;
  private httpHeaders = new HttpHeaders({'content-type': 'application/json'});
  
  fallo: boolean = false;
  data: User = {
    "userName": "",
    "password": "",
  };
  
  constructor(private http:HttpClient,private router: Router) {}
  
  public get user(): User{
    if(this._user != null){
      return this._user;
    }else if(this._user == null && sessionStorage.getItem('usuario')){
      this._user = JSON.parse(sessionStorage.getItem('usuario') || '{}') as User;
      return  this._user;
    }
    return new User();
  }

  public get token(): string{
    if(this._user != null){
      return this._token;
    }else if(this._user == null && sessionStorage.getItem('usuario')){
      return  this._token;
    }
    return "null";
  }

  public isNotAutorizado(e: { status: number; }):boolean{
    if(e.status==401){
      if(this.isAuthenticated()){
        this.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }

    if(e.status==403){
      swal.fire('Acceso denegado', `¡no tienes permisos para realizar esa accion!`,'error');
      this.reload();
      return true;
    }
    return false;
  }

  public getAuthorizationHeader():HttpHeaders {
    let token = sessionStorage.getItem('token');
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  public isAuthenticated():boolean{
    if(sessionStorage.getItem("token") != null && sessionStorage.getItem('usuario') != null){
      return true;
    } 
    return false;
  }

  public sessionName(){
    if(sessionStorage.getItem("token") != null && sessionStorage.getItem('usuario') != null){
      return sessionStorage.getItem('usuario');
    } 
    return "error";
  }

  login(body: User):Observable<any>{    
    return this.http.post<any>(urlEndpoint + "login",body,{headers: this.httpHeaders})
  }

  guardarUsuario(token: string) {
    this._user = new User();
    let payload = {
      "sub": "",
      "iat": "",
      "exp": "",
     }
    payload = this.obtenerDatosToken(token);
    this._user.userName = payload.sub;
    sessionStorage.setItem('usuario',JSON.stringify(this._user.userName))
  }

  guardarToken(token: string):void {
    sessionStorage.setItem('token',token);
    this._token = token;
  }

  obtenerDatosToken(token: string):any{
    if(token != null){   
      return jwt_decode(token)
    }
    return null;
  }

  logout(){
    this.clearSession();  
    swal.fire('Logout', `¡Has cerrado sesión con exito!`,'success');
    this.router.navigate(['/login']);
  }

  clearSession(){
    this._token = "";
    this._user = new User();
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario'); 
  }

reload(){
  window.location.reload();
}

}


