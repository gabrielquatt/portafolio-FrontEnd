import { Component, OnInit } from '@angular/core';
import { ExperienceService } from '../service/experience.service';
import { Experience } from '../Model/Experience';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { ImagesService } from '../service/images.service';
import { AlertsService } from '../service/alerts.service';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  //List
  experienceList: Experience[] = [];
  //Objects Class
  exp: Experience;
  expAux: Experience;
  expEdit: Experience;
  //Modal variable
  closeResult: String | undefined;

  constructor(
    private alert:AlertsService,
    private expService: ExperienceService, 
    private modalService: NgbModal, 
    private authService: AuthService, 
    private imgService: ImagesService) {
    this.exp = new Experience();
    this.expAux = new Experience();
    this.expEdit = new Experience();
  }

  ngOnInit(): void {
    //Read Experience
    this.expService.getAllExperience().subscribe(resp => {
      this.experienceList = resp;
    })
  }

  //============= Segurity ===================== 
  active(): boolean {
    return this.authService.isAuthenticated();
  }

  //================ CRUD Experience ====================================

  //Create
  saveExperience() {
    if (this.authService.isAuthenticated()) {

      if(this.exp.name == null || this.exp.description == null || this.exp.anio == null){
        this.alert.alertCampVacios();
      }else{

      if (!this.imgService.fotoSeleccionada) {
        this.exp.logoUrl = this.imgService.urlDefaultImg;
        this.expService.saveExp(this.exp).subscribe(res => {
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
          this.exp.idImg = res.id;
          this.exp.logoUrl = res.imagenUrl;

          this.expService.saveExp(this.exp).subscribe(res => {
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
  editExp() {
    if (this.authService.isAuthenticated()) {

      if (this.expEdit.name == null) {
        this.expEdit.name = this.expAux.name;
      }
      if (this.expEdit.anio == null) {
        this.expEdit.anio = this.expAux.anio;
      }
      if (this.expEdit.description == null) {
        this.expEdit.description = this.expAux.description;
      }
      if (this.expEdit.idImg == null) {
        this.expEdit.idImg = this.expAux.idImg;
      }
      if (this.expEdit.logoUrl == null) {
        this.expEdit.logoUrl = this.expAux.logoUrl;
      }

      if (this.imgService.fotoSeleccionada) {
        if (this.expEdit.idImg != null) {
          this.imgService.delete(this.expEdit.idImg).subscribe(r => {
            //elimina imagen previamente cargada
          }, err => {
            if (err.status == 401) {
              this.authService.clearSession();
              this.alert.alert401();
            }
          });
        }

        this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
          this.expEdit.idImg = res.id;
          this.expEdit.logoUrl = res.imagenUrl;
          this.expService.edit(this.expEdit).subscribe(r => {
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
        this.expService.edit(this.expEdit).subscribe(r => {
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
  delteExp(id: number, idImg: number): void {
    if (this.authService.isAuthenticated()) {

      if (idImg == null) {
        this.expService.delete(id).subscribe(r => {
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
          this.expService.delete(id).subscribe(r => {
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

  //================= Modals ==========================

  openModalExp(content: any, exp: Experience) {
    this.expAux = exp;
    this.expEdit.id = exp.id;
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openNewExp(content: any) {
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
      return `with: ${reason}`;
    }
  }

}
