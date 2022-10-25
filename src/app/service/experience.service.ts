import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experience } from '../Model/Experience';
const _url = '/api/experience/';

@Injectable({
  providedIn: 'root'
})

export class ExperienceService {

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

  saveExp(body: Experience) {
    return this.http.post<any>(_url + "save", body, { headers: this.agregarAuthorizationHeader() });
  }

  delete(id: any) {
    return this.http.delete(_url + "delete/" + id, { headers: this.agregarAuthorizationHeader() });
  }

  edit(body: Experience) {
    return this.http.put<any>(_url + "update", body, { headers: this.agregarAuthorizationHeader() });
  }

  getAllExperience(): Observable<Experience[]> {
    return this.http.get<Experience[]>(_url + "all");
  }

}
