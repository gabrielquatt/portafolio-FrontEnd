import { Component, OnInit } from '@angular/core';
import { Language } from '../Model/Language';
import { Skill } from '../Model/Skill';
import { LanguageService } from '../service/language.service';
import { SkillService } from '../service/skill.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../service/auth.service';
import { ImagesService } from '../service/images.service';
import { AlertsService } from '../service/alerts.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  //Lists
  skills: Skill[] = [];
  languages: Language[] = [];

  //Skill Objects Class
  skill: Skill;
  skillAux: Skill;
  skillEdit: Skill;

  //Language Objects Class
  lang: Language;
  langAux: Language;
  langEdit: Language;

  level: string;

  //Modal
  closeResult: String | undefined;

  constructor(
    private alert:AlertsService,
    private skillService: SkillService,
    private languageService: LanguageService,
    private authService: AuthService,
    private modalService: NgbModal,
    private imgService: ImagesService) {
    this.skill = new Skill();
    this.skillAux = new Skill();
    this.skillEdit = new Skill();
    this.lang = new Language();
    this.langAux = new Language();
    this.langEdit = new Language();
    this.level= "";
  }

  ngOnInit(): void {
    //Read Skill
    this.skillService.getSkills().subscribe(resp => {
      this.skills = resp;
    })

    //Read Language
    this.languageService.getLanguages().subscribe(resp => {
      this.languages = resp;
    })
  }

  //============= Segurity ===================== 
  active(): boolean {
    return this.authService.isAuthenticated();
  }

  //============ CRUD Skill =========================

  //Create
  saveSkill() {
    if (this.authService.isAuthenticated()) {
      if (this.skill.name == null || this.skill.level == null) {
        this.alert.alertCampVacios();
      } else {

        if (!this.imgService.fotoSeleccionada) {
          this.skill.imgUrl = this.imgService.urlDefaultImg;
          this.skillService.saveSkill(this.skill).subscribe(res => {
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
            this.skill.imgId = res.id;
            this.skill.imgUrl = res.imagenUrl;
            this.skillService.saveSkill(this.skill).subscribe(res => {
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

  //Update
  editSkill(): void {
    if (this.authService.isAuthenticated()) {

      if (this.skillEdit.name == null) {
        this.skillEdit.name = this.skillAux.name;
      }
      if (this.skillEdit.level == null) {
        this.skillEdit.level = this.skillAux.level;
      }
      if (this.skillEdit.imgId == null) {
        this.skillEdit.imgId = this.skillAux.imgId;
      }
      if (this.skillEdit.imgUrl == null) {
        this.skillEdit.imgUrl = this.skillAux.imgUrl;
      }

      if (this.imgService.fotoSeleccionada) {
        if (this.skillEdit.imgId != null) {
          this.imgService.delete(this.skillEdit.imgId).subscribe(r => {
            //elimina imagen previamente cargada
          }, err => {
            if (err.status == 401) {
              this.authService.clearSession();
              this.alert.alert401();
            }
          });
        }

        this.imgService.subirImgExp(this.imgService.fotoSeleccionada).subscribe(res => {
          this.skillEdit.imgId = res.id;
          this.skillEdit.imgUrl = res.imagenUrl;
          this.skillService.edit(this.skillEdit).subscribe(r => {
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

        this.skillService.edit(this.skillEdit).subscribe(r => {
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
  deleteSkill(id: number, idImg: number): void {
    if (this.authService.isAuthenticated()) {

      if (idImg == null) {
        this.skillService.delete(id).subscribe(r => {
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
          this.skillService.delete(id).subscribe(r => {
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

  //============ CRUD Language =========================

  //Create
  saveLang() {
    if(this.lang.name == null || this.lang.level == null){
      this.alert.alertCampVacios();
    }else{
    if (this.authService.isAuthenticated()) {

      this.languageService.saveLanguage(this.lang).subscribe(res => {
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
    this.lang = new Language();
  }
  }

  //Update
  editLang(): void {
    if (this.authService.isAuthenticated()) {

      if (this.langEdit.name == null) {
        this.langEdit.name = this.langAux.name;
      }
      if (this.langEdit.level == null) {
        this.langEdit.level = this.langAux.level;
      }

      this.languageService.edit(this.langEdit).subscribe(r => {
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
  deleteLang(id: number) {
    if (this.authService.isAuthenticated()) {
      this.languageService.delete(id).subscribe(r => {
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

  //============= Image =======================

  seleccionarFoto(event: Event) {
    this.imgService.seleccionarFoto(event);
  }

  //================= Modals ==========================

  openModalSkill(content: any, skill: Skill) {
    this.skillAux = skill;
    this.skillEdit.idSkill = skill.idSkill;
    this.setLevelText(skill.level);
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalLenguaje(content: any, lang: Language) {
    this.langAux = lang;
    this.langEdit.id_Lenguage = lang.id_Lenguage;
    this.setLevelText(lang.level);
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal(content: any) {
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

  private setLevelText(n: number){
    if(n === 2){
        this.level = "INTERMEDIO"
    }else if ( n === 3){
      this.level = "ALTO"
    } else if ( n === 4){
      this.level = "AVANZADO"
    }
    else{
      this.level = "BASICO"
    }
  }
}
