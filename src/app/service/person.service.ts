import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Persona } from '../Model/Person';

const _url = '/api/person/';

@Injectable({
  providedIn: 'root'
})

export class PersonService {

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

  getPerson():Observable<Persona>{
    return this.http.get<Persona>(_url+"1");
  }

  edit(body: Persona,id: number) {
    return this.http.put<any>(_url + "update/"+id, body, { headers: this.agregarAuthorizationHeader() });
  }

}
