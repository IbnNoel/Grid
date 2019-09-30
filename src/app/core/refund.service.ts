import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiResponse, AuthService} from './auth.guard.service';
import {Observable} from 'rxjs';

@Injectable()
export class RefundService {

  private readonly REFUNDS_URI = '/refund-service/refunds';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
  }

  createRefund(data: RefundView): Observable<ApiResponse<RefundView>> {
    return this.httpClient.post<ApiResponse<RefundView>>(
      this.REFUNDS_URI,
      {...data, clientId: this.authService.authInfo.clientId});
  }

  searchRefunds() {
    const params = new HttpParams().set('clientId', this.authService.authInfo.clientId);
    return this.httpClient.get<ApiResponse<PagedResponse<RefundView>>>(this.REFUNDS_URI, {params});
  }
}

export interface RefundView {
  id: number;
  transactionId: number;
  clientId: number;
  refundReason: string;
  transactionPledgeDate: string;
  createdDate: number;
}

export interface PagedResponse<T> {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  list: T[];
}
