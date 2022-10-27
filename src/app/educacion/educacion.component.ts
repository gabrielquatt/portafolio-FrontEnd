import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '../Model/Title';
import { AlertsService } from '../service/alerts.service';
import { AuthService } from '../service/auth.service';
import { EducationService } from '../service/education.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  eduList: Title[] = [];

  edu: Title;
  eduAux: Title;
  eduEdit: Title;

  closeResult: string | undefined;

  constructor(
    private alert:AlertsService,
    private eduService: EducationService,
    private modalService: NgbModal,
    private authService: AuthService) {
    this.edu = new Title();
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
      if (this.edu.name == null || this.edu.institute == null || this.edu.status == null) {
        this.alert.alertCampVacios();
      } else {

        this.eduService.saveEdu(this.edu).subscribe(res => {
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
         this.alert.alert401();
        }
        if (err.status == 403) {
          this.alert.alert403();
        }
      });

    } else {
      this.authService.clearSession();
      this.alert.alertNoAuth();
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
            this.alert.alert401();
          }
          if (err.status == 403) {
            this.alert.alert403();
          }
        });
    } else {
      this.authService.clearSession();
      this.alert.alertNoAuth();
    }
  }

  active(): boolean {
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
      return `with: ${reason}`;
    }
  }

}
