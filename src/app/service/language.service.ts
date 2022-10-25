import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Language } from '../Model/Language';

const _url = '/api/language/';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

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

  saveLanguage(body: Language) {
    return this.http.post<any>(_url + "save", body, { headers: this.agregarAuthorizationHeader() })
  }

  edit(body: Language) {
    return this.http.put<any>(_url + "update", body, { headers: this.agregarAuthorizationHeader() });
  }

  delete(id: any) {
    return this.http.delete(_url + "delete/" + id, { headers: this.agregarAuthorizationHeader() });
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(_url + "all");
  }

}
