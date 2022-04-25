import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { secret } from 'src/environments/secret';
import * as CryptoJS from 'crypto-js';

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
    this.createForm()
  }

  ngOnInit(): void {
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
    this.authService.login(this.formGroup.value.email, this.formGroup.value.password).then(
      async (response) => {
        if (response.data) {
          this.globalService.showSnackBar('Success', 3000)
          await new Promise((resolve) => {
            setTimeout(resolve, 3000);
          })
          this.cookieService.set(secret.cookie_name, CryptoJS.AES.encrypt(`${user[0].id}`, secret.cookie_name).toString(), 0.08, '/', '', true, 'Strict')
          // window.location.href = environment.redirect_auth
        } else {
          this.globalService.showSnackBar('Failed', 3000)
        }
      }
    )
  }

}
