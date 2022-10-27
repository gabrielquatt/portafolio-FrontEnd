import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../Model/Skill';

const _url = 'https://evening-plains-46907.herokuapp.com/api/skill/';

@Injectable({
  providedIn: 'root'
})

export class SkillService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  private agregarAuthorizationHeader() {
    let token = sessionStorage.getItem('token');
    if (token != null) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ` + token
      })
      return headers;
    }
    return this.httpHeaders;
  }

  saveSkill(body: Skill) {
    return this.http.post<any>(_url + "save", body, { headers: this.agregarAuthorizationHeader() })
  }

  edit(body: Skill) {
    return this.http.put<any>(_url + "update", body, { headers: this.agregarAuthorizationHeader() })
  }

  delete(id: number) {
    return this.http.delete(_url + "delete/" + id, { headers: this.agregarAuthorizationHeader() });
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(_url + "all");
  }

}
