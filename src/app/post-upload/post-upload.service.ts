import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostUploadService {
  constructor(private http: HttpClient, private router: Router) {}

  getNewPostData(post: FormData) {
    return this.http
      .post('http://localhost:3001/api/post/upload', post, {
        withCredentials: true,
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .subscribe((res) => this.router.navigate(['/post-list']));
  }
}
