import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';
import { secret } from 'src/environments/secret';
import * as CryptoJS from 'crypto-js';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function ConfirmedValidator(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['confirmedValidator']) {
          return;
      }
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ confirmedValidator: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loaded = false

  matcher = new MyErrorStateMatcher();
  hidePassword = true;

  formGroup!: FormGroup
  email = new FormControl('', [Validators.required, Validators.email])
  password = new FormControl('', [Validators.required])
  repeat_password = new FormControl('', [Validators.required])

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
      repeat_password: this.repeat_password,
    }, { 
      validator: ConfirmedValidator('password', 'repeat_password')
    });
  }

  isInvalid() {
    return this.formGroup.invalid
  }

  onRegister() {
    this.loaded = false
    this.authService.register(this.formGroup.value.email, this.formGroup.value.password).then(
      async (response) => {
        this.globalService.showSnackBar('Success, please login', 3000)
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        })
        window.location.href = environment.redirect_auth
        this.loaded = true
      },
      (error) => {
        this.globalService.showSnackBar('Failed, email already registered', 3000)
        this.loaded = true
      }
    )
  }

}
