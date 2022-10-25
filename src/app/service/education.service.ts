import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '../Model/Title';

const _url = "/api/information/";

@Injectable({
  providedIn: 'root'
})
export class EducationService {

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http:HttpClient) { }

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

  getAllExperience():Observable<Title[]>{
    return this.http.get<Title[]>(_url+"all");
  }

  saveEdu(body: Title) {
    return this.http.post<any>(_url + "save", body, { headers: this.agregarAuthorizationHeader() })
  }

  edit(body: Title) {
    return this.http.put<any>(_url + "update", body, { headers: this.agregarAuthorizationHeader() });
  }

  delete(id: any) {
    return this.http.delete(_url + "delete/" + id, { headers: this.agregarAuthorizationHeader() });
  }

}
