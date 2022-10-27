import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Proyect } from '../Model/Proyect';
import { AuthService } from '../service/auth.service';
import { ProyectService } from '../service/proyect.service';
import { ImagesService } from '../service/images.service';
import { AlertsService } from '../service/alerts.service';
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
    private alert:AlertsService,
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
      if(this.p.name == null || this.p.description == null || this.p.link == null){
        this.alert.alertCampVacios();
      }else{
        if (!this.imgService.fotoSeleccionada) {
          this.p.imgProyect = this.imgService.urlDefaultImg;
          this.pService.saveProject(this.p).subscribe(res => {
  
            this.authService.reload();
          }, err => {
            if (err.status == 401) {
              this.authService.clearSession();
              this.alert.alert401();
            }
            if (err.status == 403) {
              this.alert.alert403();
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
                this.alert.alert401();
              }
              if (err.status == 403) {
                this.alert.alert403();
              }
            });
          });
        }
      }
    } else {
      this.authService.clearSession();
      this.alert.alertNoAuth();
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
      if (this.pEdit.link == null) {
        this.pEdit.link = this.pAux.link;
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
              this.alert.alert401();
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
              this.alert.alert401();
            }
            if (err.status == 403) {
              this.alert.alert403();
            }
          });
        });
      } else {
        this.pService.edit(this.pEdit).subscribe(r => {
          this.authService.reload();
        }, err => {
          if (err.status == 401) {
            this.authService.clearSession();
            this.alert.alert401();
          }
          if (err.status == 403) {
            this.alert.alert403();
          }
        });
      }
    } else {
      this.authService.clearSession();
      this.alert.alertNoAuth();
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
            this.alert.alert401();
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
            this.alert.alert401();
          }
          if (err.status == 403) {
            this.alert.alert403();
          }
        });
      }

    } else {
      this.authService.clearSession();
      this.alert.alertNoAuth();
    }
  }

  //============= Image =======================
  
  seleccionarFoto(event: Event) {
    this.imgService.seleccionarFoto(event);
  }

  subirImgExp(): any {
    if (!this.imgService.fotoSeleccionada) {
      this.alert.alertCampVaciosImg();
    } else {
      this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
        console.log(res);
      });
      
      this.alert.alertSaveImgSuccess();
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
