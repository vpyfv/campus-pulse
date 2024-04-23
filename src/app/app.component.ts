import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Emitter } from './emitter/emitter';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    HomeComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'campus-pulse';
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    Emitter.authEmitter.subscribe((status) =>
      status
        ? this.router.navigate(['home'])
        : this.router.navigate(['sign-in'])
    );
    this.checkUserStatus();
  }

  checkUserStatus() {
    this.http
      .get('http://localhost:3001/api/user', { withCredentials: true })
      .pipe(
        catchError((err, caught) => {
          Emitter.authEmitter.next(false);
          return of();
        })
      )
      .subscribe((res) => {
        Emitter.authEmitter.next(true);
      });
  }
}
