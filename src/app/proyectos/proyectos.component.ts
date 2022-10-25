import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Proyect } from '../Model/Proyect';
import { AuthService } from '../service/auth.service';
import { ProyectService } from '../service/proyect.service';
import { ImagesService } from '../service/images.service';
// import swal from 'sweetalert2';
import swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  //List
  proyectList: Proyect[]=[];
  //Modal variable
  closeResult: String | undefined;
  //Objects Class
  p:Proyect;
  pAux: Proyect;
  pEdit: Proyect;

  constructor(
    private pService:ProyectService,
    private modalService: NgbModal,
    private authService: AuthService,
    private imgService: ImagesService
    ) {
    this.p = new Proyect();
    this.pAux = new Proyect();
    this.pEdit = new Proyect();
   }
  
  
  ngOnInit(): void {
      this.pService.getProyects().subscribe(resp => {
        this.proyectList = resp;
      })
  }

  //================ CRUD Experience ====================================

  //Create
  saveProyect() {
    if (this.authService.isAuthenticated()) {
      if (!this.imgService.fotoSeleccionada) {
        this.p.imgProyect = this.imgService.urlDefaultImg;
        this.pService.saveProject(this.p).subscribe(res => {

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

        this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
          this.p.imgId = res.id;
          this.p.imgProyect = res.imagenUrl;

          this.pService.saveProject(this.p).subscribe(res => {
            this.imgService.fotoSeleccionada = null;
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
        });
      }

    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  //Edit
  editProyect() {
    if (this.authService.isAuthenticated()) {

      if (this.pEdit.name == null) {
        this.pEdit.name = this.pAux.name;
      }
      if (this.pEdit.description == null) {
        this.pEdit.description = this.pAux.description;
      }
      if (this.pEdit.imgId == null) {
        this.pEdit.imgId = this.pAux.imgId;
      }
      if (this.pEdit.imgProyect == null) {
        this.pEdit.imgProyect = this.pAux.imgProyect;
      }

      if (this.imgService.fotoSeleccionada) {
        if (this.pEdit.imgId != null) {
          this.imgService.delete(this.pEdit.imgId).subscribe(r => {
            //elimina imagen previamente cargada
          }, err => {
            if (err.status == 401) {
              this.authService.clearSession();
              swal.fire('ERROR', '¡no autenticado!', 'error')
            }
          });
        }

        this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
          this.pEdit.imgId = res.id;
          this.pEdit.imgProyect = res.imagenUrl;
          this.pService.edit(this.pEdit).subscribe(r => {
            this.imgService.fotoSeleccionada = null;
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
        });
      } else {
        this.pService.edit(this.pEdit).subscribe(r => {
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
      }
    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  //Delete
  delteProyect(id: number, idImg: number): void {
    if (this.authService.isAuthenticated()) {

      if (idImg == null) {
        this.pService.delete(id).subscribe(r => {
          //si no ahi imagen eliminan datos de la experiencia laboral               
          this.authService.reload();
        }, err => {
          if (err.status == 401) {
            this.authService.clearSession();
            swal.fire('ERROR', '¡no autenticado!', 'error')
          }
        });
      } else {
        this.imgService.delete(idImg).subscribe(r => {
          this.pService.delete(id).subscribe(r => {
            //elimina la imagen y luego los datos de la experiencia laboral  
            this.authService.reload();
          });
        }, err => {
          if (err.status == 401) {
            this.authService.clearSession();
            swal.fire('ERROR', '¡no autenticado!', 'error')
          }
          if (err.status == 403) {
            swal.fire('Acceso denegado', `¡no tienes permisos para realizar esa accion!`, 'error');
          }
        });
      }

    } else {
      this.authService.clearSession();
      swal.fire('Error', `no se encuentra autenticado`, 'info')
    }
  }

  //============= Image =======================
  
  seleccionarFoto(event: Event) {
    this.imgService.seleccionarFoto(event);
  }

  subirImgExp(): any {
    if (!this.imgService.fotoSeleccionada) {
      swal.fire('Error: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
        console.log(res);
      });
      swal.fire('Finalizado!', 'la foto se  cambio correctamente', 'success');
    }
  }

   //============= Segurity ===================== 
   active(): boolean {
    return this.authService.isAuthenticated();
  } 
  
  //================= Modals ==========================

  openModal(content: any, p: Proyect) {
    this.pAux = p;
    this.pEdit.id_proyect = p.id_proyect;
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalProyect(content: any) {
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
