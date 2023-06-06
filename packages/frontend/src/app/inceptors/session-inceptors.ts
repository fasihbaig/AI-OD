import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '@app/services';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
  private readonly TOKEN = 'your_token_here'; // Replace with your actual token

  intercept(
    request: HttpRequest<any>, 
    next: HttpHandler,
    ): Observable<HttpEvent<any>> {
    // Clone the request and add the token as a header
    const modifiedRequest = request.clone({
      setHeaders: {
        session: window.localStorage.getItem("sessionId") || ""
      }
    });

    // Pass the modified request to the next interceptor or the HTTP handler
    return next.handle(modifiedRequest);
  }
}
