import { Component, OnInit } from '@angular/core';
import { Persona } from '../Model/Person';
import { PersonService } from '../service/person.service';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.css']
})
export class PageHomeComponent implements OnInit {
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
