import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '../Model/Title';
import { AuthService } from '../service/auth.service';
import { EducationService } from '../service/education.service';
// import swal from 'sweetalert2';
import swal from 'sweetalert2/dist/sweetalert2.js';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  eduList: Title[] = [];

  edu:Title;
  eduAux:Title;
  eduEdit:Title;
  
  closeResult: string | undefined;

  constructor(
    private eduService:EducationService,
    private modalService: NgbModal, 
    private authService: AuthService) { 
      this.edu=new Title();
      this.eduAux = new Title();
      this.eduEdit = new Title();
    }

  ngOnInit(): void {
    this.eduService.getAllExperience().subscribe(resp => {
      this.eduList = resp;
    })
  }

  //============ CRUD Language =========================

  //Create
  saveEdu() {

    if (this.authService.isAuthenticated()) {
   
      this.eduService.saveEdu(this.edu).subscribe(res => {
        this.authService.reload();
      }, err => {
        if (err.status == 401) {
          this.authService.clearSession();
          swal.fire('ERROR', '¡no autenticado!', 'error')
        }
        if (err.status == 403) {
          swal.fire('Acceso denegado', `¡no tienes permisos para realizar esa accion!`, 'error');
        }
      });
    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  //Update
  editEdu(): void {
    if (this.authService.isAuthenticated()) {

      if (this.eduEdit.institute == null) {
        this.eduEdit.institute = this.eduAux.institute;
      }
      if (this.eduEdit.name == null) {
        this.eduEdit.name = this.eduAux.name;
      }
      if (this.eduEdit.status == null) {
        this.eduEdit.status = this.eduAux.status;
      }

      this.eduService.edit(this.eduEdit).subscribe(r => {
        this.authService.reload();
      }, err => {
        if (err.status == 401) {
          this.authService.clearSession();
          swal.fire('ERROR', '¡no autenticado!', 'error')
        }
        if (err.status == 403) {
          swal.fire('Acceso denegado', `¡no tienes permisos para realizar esa accion!`, 'error');
        }
      });

    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  //Delete
  deleteEdu(id: number) {
    if (this.authService.isAuthenticated()) {
      this.eduService.delete(id).subscribe(r => {
        this.authService.reload();
      },
        err => {
          if (err.status == 401) {
            this.authService.clearSession();
            swal.fire('ERROR', '¡no autenticado!', 'error')
          }
          if (err.status == 403) {
            swal.fire('Acceso denegado', `¡no tienes permisos para realizar esa accion!`, 'error');
          }
        });
    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  active() : boolean {
    return this.authService.isAuthenticated();
  }

  openNewEdu(content: any) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  openModalTitle(content: any, e: Title) {
    this.eduAux = e;
    this.eduEdit.idTitle = e.idTitle;
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
