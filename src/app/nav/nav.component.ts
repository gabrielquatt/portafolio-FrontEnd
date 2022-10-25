import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  protected sessionName;
  
  constructor(private authService: AuthService) { 
    this.sessionName = this.authService.sessionName();
  }

  active() : boolean {
    return this.authService.isAuthenticated();
  }

  logout():void{
    this.authService.logout();
    
  }

  ngOnInit(): void {
  }

}
