import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { AuthComponent } from './components/auth/auth.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { secret } from 'src/environments/secret';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    SocialLoginModule,

    BrowserAnimationsModule
  ],
  providers: [
    {provide: 'SocialAuthServiceConfig', useValue: {
      autoLogin: true,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            /*
            | -------------------------------------------------------------------
            |  Create file secret.ts and secret.prod.ts in environments folder fill this code:
            |  export const secret = {
            |    googleClientId : 'your-client-id.apps.googleusercontent.com'
            |  };
            */
            secret.googleClientId
          )
        }
      ]
    } as SocialAuthServiceConfig},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
