import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  showSnackBar(message: string, duration: number) {
    this.snackBar.open(message, 'CLOSE', {
      duration: duration
    }).onAction().subscribe(() => {
      this.snackBar.dismiss();
    });
  }
}
