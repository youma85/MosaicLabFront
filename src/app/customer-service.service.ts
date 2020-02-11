import { Injectable } from '@angular/core';
import { Customer } from './customer-list/customer-list.component';
import { Observable, of } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PageClient } from './models/PageClient';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {
  private url = 'http://localhost:8080/Customer';

  constructor(private http: HttpClient) { }

 getPageClient(page: number, size: number): Observable<PageClient> {
    let url = this.url;
    url = url + '?page=' + page + '&size='+ size;
    return this.http.get<PageClient>(url)
    .pipe(
      map(response => {
        const data = response;
        console.log(data.content);
        return data ;
      }));
  }

  countAll(): Observable<number> {
    const url = this.url + '/size';
    return this.http.get<number>(url);
  }

}
