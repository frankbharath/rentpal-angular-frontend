import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NEVER, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators'
import { ProgressBarService } from './progress-bar.service';

@Injectable({
  providedIn: 'root'
})

export class InterceptorService implements HttpInterceptor{

  constructor(private progressBar:ProgressBarService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressBar.showLoading();
    const customReq = req.clone({
      withCredentials:true
  });
    return next.handle(customReq).pipe(
      finalize(()=>{
        this.progressBar.hideLoading();
      }),
      catchError(this.handleError)
    );

  }

  handleError(error:HttpErrorResponse){
    // the user is not authenticated, show login page.
    if(error.status === 401 || error.status === 403){
      window.location.href="/login";
      return NEVER;
    }
    return throwError(error);
}
}
