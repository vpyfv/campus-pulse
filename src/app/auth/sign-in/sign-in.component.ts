import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
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
