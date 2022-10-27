import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

const _url = "https://evening-plains-46907.herokuapp.com/api/cloudinary/";


@Injectable({
  providedIn: 'root'
})

export class ImagesService {
  public fotoSeleccionada: any;
   private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  public urlDefaultImg: String;
  
  constructor(private http:HttpClient) { 
    this.urlDefaultImg = "https://res.cloudinary.com/dofzljqg7/image/upload/v1666733928/default_wfetmj.png";
  }
  
  private agregarAuthorizationHeader() {
    let token = sessionStorage.getItem('token');
    if (token != null) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer `+ token
      })
      return headers;
    }
    return this.httpHeaders;   
  }

  delete(imgId: number) {
    return this.http.delete(_url + "delete/"+ imgId, { headers: this.agregarAuthorizationHeader()});
  }
  
  subirImgExp(archivo: File){
    let formData = new FormData();
    formData.append("multipartFile", archivo);

    let httpHeaders = new HttpHeaders();
    let token = sessionStorage.getItem('token');
    if (token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    }
  
    return this.http.post<any>(_url + "upload", formData,{
      reportProgress: true,
      headers: httpHeaders
    });
  }

  seleccionarFoto(event: Event){
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
     this.fotoSeleccionada= fileList[0];
     if (this.fotoSeleccionada.type.indexOf('image') < 0) {
       swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
       this.fotoSeleccionada = null;
     }
    } 
  }
}
