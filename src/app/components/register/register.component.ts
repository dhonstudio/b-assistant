import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { environment } from 'src/environments/environment';

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
  ) { 
    this.createForm()
  }

  ngOnInit(): void {
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
    this.authService.register(this.formGroup.value.email, this.formGroup.value.password).then(
      async (response) => {
        this.globalService.showSnackBar('Success, please login', 3000)
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        })   
        window.location.href = environment.redirect_auth
      },
      (error) => {
        this.globalService.showSnackBar('Failed, email already registered', 3000)
      }
    )
  }

}