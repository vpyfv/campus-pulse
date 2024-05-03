import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Emitter } from '../../emitter/emitter';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  error: { isTrue: boolean; message: string } = {
    isTrue: false,
    message: '',
  };

  private async showErrorMessage(err: any) {
    this.error = { isTrue: true, message: err.error.message };
    await new Promise((f) => setTimeout(f, 3000));
    this.error = { isTrue: false, message: '' };
  }

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((isSigned) =>
      isSigned ? this.router.navigate(['/post-list']) : {}
    );
  }

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSignIn() {
    if (this.signInForm.valid) {
      this.http
        .post('http://localhost:3001/api/user/signin', this.signInForm.value, {
          withCredentials: true,
        })
        .pipe(
          catchError((err, caught) => {
            console.log('error', err);
            this.showErrorMessage(err);
            this.signInForm.reset();
            return of();
          })
        )
        .subscribe((res: any) => Emitter.authEmitter.next(true));
      this.signInForm.reset();
    } else {
      this.showErrorMessage({ error: { message: 'invalid input' } });
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.http
        .post('http://localhost:3001/api/user/signup', this.signUpForm.value, {
          withCredentials: true,
        })
        .pipe(
          catchError((err, caught) => {
            console.log('error', err);
            this.showErrorMessage(err);
            this.signUpForm.reset();
            return of();
          })
        )
        .subscribe((res: any) => {
          Emitter.authEmitter.next(true);
        });
    } else {
      this.showErrorMessage({ error: { message: 'invalid input' } });
    }
  }
}
