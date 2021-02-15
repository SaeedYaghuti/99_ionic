import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class NewsService {

  constructor(
    private http: HttpClient,
    // public constService: ConstService
  ) { }

  getNews() {
    let authtoken = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', authtoken);
    // return this.http.get(this.constService.base_url + 'api/news', {
    //   headers: headers
    // });
    return null;
  }


}
