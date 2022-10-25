import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.authService.logout();
        }
        return true;
      }
      this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado():boolean{
    let token = this.authService.token;
    let playload = this.authService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if(playload.exp < now){
      return true;
    }
    return false;
  }
  
}
