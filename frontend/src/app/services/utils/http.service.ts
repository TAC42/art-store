import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private BASE_URL = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  get<T>(endpoint: string, data?: any): Observable<T> {
    const params = new HttpParams({ fromObject: data })
    return this.http.get<T>(this.BASE_URL + endpoint, { params }).pipe(
      catchError(this.handleError)
    )
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(this.BASE_URL + endpoint, data).pipe(
      catchError(this.handleError)
    )
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(this.BASE_URL + endpoint, data).pipe(
      catchError(this.handleError)
    )
  }

  delete<T>(endpoint: string, data?: any): Observable<T> {
    const options = data ? { body: data } : {}
    return this.http.delete<T>(this.BASE_URL + endpoint, options).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: any): Observable<never> {
    console.error('HTTP Service Error: ', error)
    return throwError(() => new Error(error.message
      || 'An unknown error occurred'))
  }
}