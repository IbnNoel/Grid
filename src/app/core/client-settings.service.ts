import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { ApiResponse } from './auth.guard.service';
import { PagedResponse } from './refund.service';
import { OperatorFunction, of, throwError } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientSettingsService {

  constructor(private httpClient: HttpClient) { }

  private readonly ROUTE_URL = '/refund-service';

  private apiResponseMap: OperatorFunction<ApiResponse<any>,any> =  flatMap(response => { 
    if(response.success){
        return of(response.data);
      }else {
        return throwError(response.error);
      }
    });

  getClients(name : string, pageNo, size){
    let GET_CLIENT_URL = `${this.ROUTE_URL}/client/search`;
    const params = new HttpParams().set('name', name)
      .set('page', pageNo).set('size', size);

    return this.httpClient.get<ApiResponse<PagedResponse<Client>>>(GET_CLIENT_URL, {params}).pipe(this.apiResponseMap);
  }

}

export interface Client{
  cctClientId: string,
  country: string,
  countrySegment: string,
  id: number,
  industrySegment: string,
  name: string,
  refundConfigured: boolean
}
