import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

import { Credentials } from '~/app/shared/models/credentials.type';
import { AppMainConfig, AppMainConfigService } from '~/app/shared/services/app-main-config.service';

export type HttpHeaders = Record<string, any>;

export type S3gwApiServiceRequestOptions = {
  body?: any | null;
  credentials: Credentials;
  headers?: HttpHeaders;
  params?: HttpParams | { [param: string]: string | number | boolean };
};

/**
 * Service to handle s3gw-ui REST API requests.
 */
@Injectable({
  providedIn: 'root'
})
export class S3gwApiService {
  config: AppMainConfig;

  constructor(private http: HttpClient, private appCustomConfigService: AppMainConfigService) {
    this.config = this.appCustomConfigService.config;
  }

  get<T>(url: string, options: S3gwApiServiceRequestOptions): Observable<T> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.get<T>(this.buildUrl(url), {
      ..._.pick(options, ['headers', 'params']),
      headers
    });
  }

  head<T>(url: string, options: S3gwApiServiceRequestOptions): Observable<T> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.head<T>(this.buildUrl(url), {
      ..._.pick(options, ['headers', 'params']),
      headers
    });
  }

  put<T>(url: string, options: S3gwApiServiceRequestOptions): Observable<T> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.put<T>(this.buildUrl(url), options.body, {
      ..._.pick(options, ['headers', 'params']),
      headers
    });
  }

  post<T>(url: string, options: S3gwApiServiceRequestOptions): Observable<T> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.post<T>(this.buildUrl(url), options.body, {
      ..._.pick(options, ['headers', 'params']),
      headers
    });
  }

  delete<T>(url: string, options: S3gwApiServiceRequestOptions): Observable<T> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.delete<T>(this.buildUrl(url), {
      ..._.pick(options, ['body', 'headers', 'params']),
      headers
    });
  }

  download(url: string, options: S3gwApiServiceRequestOptions): Observable<Blob> {
    const headers: HttpHeaders = this.buildHeaders(options.credentials);
    return this.http.post(this.buildUrl(url), options.body, {
      headers,
      responseType: 'blob',
      observe: 'body'
    });
  }

  private buildUrl(url: string): string {
    return `${this.config.ApiPath}/${_.trimStart(url, '/')}`;
  }

  private buildHeaders(credentials: Credentials): HttpHeaders {
    return {
      /* eslint-disable @typescript-eslint/naming-convention */
      'S3GW-Credentials': `${credentials.accessKey}:${credentials.secretKey}`
      /* eslint-enable @typescript-eslint/naming-convention */
    };
  }
}
