import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'
import { ProgressBarService } from './progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private progressBar:ProgressBarService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.progressBar.showLoading();
    const customReq = req.clone({
      setHeaders: {email: "franklinbharathkumar@outlook.com",id:"4"}
  });
    return next.handle(customReq).pipe(
      finalize(()=>{
        this.progressBar.hideLoading();
      })
    );

  }
}
