import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Emitter } from '../../emitter/emitter';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((isSigned) =>
      isSigned ? this.router.navigate(['/post-list']) : {}
    );
  }

  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  signUpForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]+$/)
    ]),
  });

  onSignIn() {
    this.http
      .post('http://localhost:3001/api/user/signin', this.signInForm.value, {
        withCredentials: true,
      })
      .pipe(
        catchError((err, caught) => {
          console.log('error', err);
          return of();
        })
      )
      .subscribe((res: any) => Emitter.authEmitter.next(true));
    this.signInForm.reset();
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
          return of();
        })
      )
      .subscribe((res: any) => {
        Emitter.authEmitter.next(true);
      });
  }
}
}
