import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { secret } from 'src/environments/secret';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  userId!: number;

  constructor(
    private cookieService: CookieService,
  ) { 
    this.checkCookie()
  }

  ngOnInit(): void {
  }

  private checkCookie() {
    if (this.cookieService.get(secret.cookie_name)) {
      this.userId = parseInt(CryptoJS.AES.decrypt(this.cookieService.get(secret.cookie_name), secret.cookie_name).toString(CryptoJS.enc.Utf8))
      console.log(this.userId);
      
      // this.initUser()
    } 
  }

}
