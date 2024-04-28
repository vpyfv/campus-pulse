import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { Emitter } from './emitter/emitter';
import { catchError, of } from 'rxjs';
import { PostListComponent } from './post-list/post-list.component';
import { MatIconModule } from '@angular/material/icon';
import { PostUploadComponent } from './post-upload/post-upload.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    NavigationComponent,
    PostListComponent,
    PostUploadComponent,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    ReactiveFormsModule,
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
        ? this.router.navigate(['post-list'])
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
