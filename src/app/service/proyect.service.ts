import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyect } from '../Model/Proyect';

const _url = 'https://evening-plains-46907.herokuapp.com/api/proyect/';

@Injectable({
  providedIn: 'root'
})
export class ProyectService {

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

  getProyects():Observable<Proyect[]>{
    return this.http.get<Proyect[]>(_url+"all");
  }

  saveProject(body: Proyect) {
    return this.http.post<any>(_url + "save", body, { headers: this.agregarAuthorizationHeader() })
  }

  edit(body: Proyect) {
    return this.http.put<any>(_url + "update", body, { headers: this.agregarAuthorizationHeader() });
  }

  delete(id: any) {
    return this.http.delete(_url + "delete/" + id, { headers: this.agregarAuthorizationHeader() });
  }

}
