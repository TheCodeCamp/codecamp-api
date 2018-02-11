import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileUploadService {

  public domain = 'http://localhost:3000';
  constructor(
    private http: Http
  ) { }

  fileUpload(fileData) {
    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        const options = new RequestOptions({ headers: headers });
        this.http.post(this.domain, fileData, options)
            .map(res => res.json());
  }
}
