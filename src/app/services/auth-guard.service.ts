import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { secret } from 'src/environments/secret';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private cookieService: CookieService,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    /*
    | -------------------------------------------------------------------
    |  Create/update file secret.ts and secret.prod.ts in environments folder fill this code:
    |  export const secret = {
    |    cookie_name: 'cookie_name'
    |  };
    */
    if (this.cookieService.get(secret.cookie_name)) {
      return true
    } else {
      return this.socialAuthService.authState.pipe(
        map((socialUser: SocialUser) => !!socialUser),
        tap((isLoggedIn: boolean) => {
          if (!isLoggedIn) {
            this.router.navigate(['auth'], { queryParams: { returnUrl: state.url }});
          }
        }
      ))
      // return false
      // return this._socialAuthService.authState.pipe(
      //   map((socialUser: SocialUser) => !!socialUser),
      //   tap((isLoggedIn: boolean) => {
      //     if (!isLoggedIn) {
      //       window.location.href = environment.redirect_auth
      //     }
      //   })
      // );
    }
  }
}