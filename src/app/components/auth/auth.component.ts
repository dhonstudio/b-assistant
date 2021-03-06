import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { secret } from 'src/environments/secret';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  loaded = false

  matcher = new MyErrorStateMatcher();
  hidePassword = true;

  formGroup!: FormGroup
  email = new FormControl('', [Validators.required, Validators.email])
  password = new FormControl('', [Validators.required])

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private globalService: GlobalService,
    private cookieService: CookieService,
  ) {
    if (this.checkCookie()) this.createForm()
  }

  ngOnInit(): void {
  }

  private checkCookie() {
    if (this.cookieService.get(secret.cookie_name)) {
      const userId = parseInt(CryptoJS.AES.decrypt(this.cookieService.get(secret.cookie_name), secret.cookie_name).toString(CryptoJS.enc.Utf8))
      this.authService.getUsers({param: "id_user", value: userId}).then(result => {
        if (result.length > 0) {
          this.loaded = true
          window.location.href = environment.redirect_auth
          return false          
        }
      })     
    }
    this.loaded = true
    return true
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  isInvalid() {
    return this.formGroup.invalid
  }

  onLogin() {
    this.loaded = false
    this.authService.login(this.formGroup.value.email, this.formGroup.value.password).then(
      async (response) => {
        if (response.data) {
          this.globalService.showSnackBar('Success', 3000)
          const user = (await this.authService.getUsers({param: "email", value: this.formGroup.value.email}))
          this.cookieService.set(secret.cookie_name, CryptoJS.AES.encrypt(`${user[0].id_user}`, secret.cookie_name).toString(), 0.08, '/', '', true, 'Strict')
          await new Promise((resolve) => {
            setTimeout(resolve, 2000);
          })
          window.location.href = environment.redirect_auth
          this.loaded = true
        } else {
          this.globalService.showSnackBar('Failed', 3000)
          this.loaded = true
        }
      }
    )
  }

}
