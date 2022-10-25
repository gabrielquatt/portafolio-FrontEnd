import { Component, OnInit } from '@angular/core';
import { PersonService } from '../service/person.service';
import { Persona } from '../Model/Person';
import { AuthService } from '../service/auth.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImagesService } from '../service/images.service';
// import swal from 'sweetalert2';
import swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {

  //Persona
  person: Persona;
  pAux: Persona;
  pEdit: Persona;

 //Modal
 closeResult: String | undefined;

  constructor(private personService:PersonService, 
    private authService: AuthService,
    private modalService: NgbModal,
    private imgService: ImagesService) 
  { 
    this.person= new Persona(); //InfoRead
    this.pAux = new Persona();  //InfoAux
    this.pEdit = new Persona(); //InfoEdit
  }

  ngOnInit(): void {
    this.personService.getPerson().subscribe(resp=>{
      this.person = resp;
      this.pEdit.id_Person = 1;
  });
  }

  //Update
  editPerson(): void {
    if (this.authService.isAuthenticated()) {
      

      if (this.pEdit.name == null) {
        this.pEdit.name = this.pAux.name;
      }
      if (this.pEdit.last_name == null) {
        this.pEdit.last_name = this.pAux.last_name;
      }
      if (this.pEdit.img_perfil == null) {
        this.pEdit.img_perfil = this.pAux.img_perfil;
      }
      if (this.pEdit.about == null) {
        this.pEdit.about = this.pAux.about;
      }
      if (this.pEdit.birthday == null) {
        this.pEdit.birthday = this.pAux.birthday;
      }
      if (this.pEdit.ocupation == null) {
        this.pEdit.ocupation = this.pAux.ocupation;
      }
      if (this.pEdit.mail == null) {
        this.pEdit.mail = this.pAux.mail;
      }

      //Verifica Si se cambia la imagen de perfil
      if (this.imgService.fotoSeleccionada) {
        if (this.pEdit.img_id != null) {
          this.imgService.delete(this.pEdit.img_id).subscribe(r => {
            //elimina imagen previamente cargada
          }, err => {
            if (err.status == 401) {
              this.authService.clearSession();
              swal.fire('ERROR', '¡no autenticado!', 'error')
            }
          });
        }
          this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
            this.pEdit.img_id = res.id;
            this.pEdit.img_perfil = res.imagenUrl;
            this.personService.edit(this.pEdit, this.pEdit.id_Person).subscribe(r => {
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
        this.personService.edit(this.pEdit, this.pEdit.id_Person).subscribe(r => {
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

   //============= Image =======================

   seleccionarFoto(event: Event) {
    this.imgService.seleccionarFoto(event);
  }

    //================= Modals ==========================

  active() : boolean {
    return this.authService.isAuthenticated();
  }

  openModalEditPerfil(content: any, p: Persona) {
    this.pAux = p;
    this.pEdit.id_Person = p.id_Person;
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
