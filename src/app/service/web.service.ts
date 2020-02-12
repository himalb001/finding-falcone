import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebService {
  
  /**
   * API basepath
   */
  apiBasePath:string = environment.apiBaseURL;


  constructor( private httpService: HttpClient) { }

  /**
   * Basepath
   */
  public setBasePath(basePath:string) {
    this.apiBasePath = basePath;
  }



  /**
   * Gets JSON from relativePath 
   * 
   * @param relativePath Relative path of the resource
   */
  public getJSON(relativePath:string):Observable<any> {
    return this.httpService.get<JSON>(this.apiBasePath + relativePath);
  }

  /**
   * Gets JSON from relativePath 
   * 
   * @param relativePath Relative path of the resource
   */
  public postJSON(relativePath: string, httpOptions, body:any={}): Observable<any> {
    return this.httpService.post<JSON>(this.apiBasePath + relativePath, body, httpOptions);
  }
  
  /**
   * name
   */
  public name() {
    
  }
}
