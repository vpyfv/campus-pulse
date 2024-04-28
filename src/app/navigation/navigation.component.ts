import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { Emitter } from '../emitter/emitter';
import { Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navigation',
  standalone: true,
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  imports: [SignInComponent, RouterModule],
})
export class NavigationComponent implements OnInit {
  public signedIn: boolean = false;
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((signInStatus) => {
      if (!signInStatus) {
        this.router.navigate(['sign-in']);
      }
      this.signedIn = signInStatus;
    });
  }

  onSignOut() {
    this.http
      .post(
        'http://localhost:3001/api/user/signout',
        {},
        { withCredentials: true }
      )
      .pipe(
        catchError((err, caught) => {
          console.log('error', err);
          return of();
        })
      )
      .subscribe((res: any) => {
        Emitter.authEmitter.next(false);
      });
  }
}