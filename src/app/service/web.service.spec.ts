
import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WebService } from './web.service';
import { environment } from 'src/environments/environment';

describe('WebService', () => {

  let httpMock:HttpTestingController;
  let service: WebService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WebService, { provide: environment.apiBaseURL, useValue: "https://example.com/"}]
    });
    const injector = getTestBed();
    service = injector.get(WebService);
    httpMock = injector.get(HttpTestingController)
  });



  /**
   * Generic creation
   */
  it('should be created', () => {
    const service: WebService = TestBed.get(WebService);
    expect(service).toBeTruthy();
  });



  /**
   * Mock HTTP to test get request
   */
  it("should get JSON",(done)=>{

    const relativePath = "test"

    service.getJSON(relativePath).subscribe(res=>{
      expect(res.token).toBe("tokenA");
      done();
    });

    // Mock http get request
    let jsonRequest = httpMock.expectOne({method: 'GET', url: service.apiBasePath + relativePath});
    jsonRequest.flush({token: "tokenA"});
    httpMock.verify();
  })
  

  /**
   * MOCK HTTP post
   */
  it("should post JSON", (done) => {

    const relativePath = "test"

    // http options for post request
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    }
    
    // mock response to be returned from http service
    const bodyMock:any = {
      vehicle: [
        "vehicle2",
        "vehicle1",
      ],
      planet:[
        "OOO"
      ]
    };


    // Test the function
    service.postJSON(relativePath, httpOptions, {}).subscribe(res => {
      // Response should match mock response
      expect(res).toBe(bodyMock);
      done();
    });

    // Mock http service
    let jsonRequest = httpMock.expectOne({ method: 'POST', url: service.apiBasePath + relativePath });
    jsonRequest.flush(bodyMock);
    httpMock.verify();
    
  })

});
