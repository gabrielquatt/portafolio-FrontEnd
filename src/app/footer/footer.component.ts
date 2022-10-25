import { Component, OnInit } from '@angular/core';
import { Persona } from '../Model/Person';
import { PersonService } from '../service/person.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  person: Persona;
  
  constructor(private personService:PersonService ) {
    this.person= new Persona(); //InfoRead
   }


  ngOnInit(): void {
    this.personService.getPerson().subscribe(resp=>{
      this.person = resp;
  });
  }

}
