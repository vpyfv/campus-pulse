import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PostListService } from './post-list.service';
import { Post } from './post.mode';
import { catchError, map, of, Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { Emitter } from '../emitter/emitter';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatIconModule],
  providers: [PostListService],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  private postSub: Subscription;
  private authSub: Subscription;
  constructor(
    private service: PostListService,
    private router: Router,
    private http: HttpClient
  ) {
    this.postSub = new Subscription();
    this.authSub = new Subscription();
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  posts: Post[] = [];

  ngOnInit(): void {
    this.checkUserStatus();
    this.authSub = Emitter.authEmitter.subscribe((signInStatus) => {
      if (!signInStatus) {
        this.router.navigate(['sign-in']);
      }
      this.service.getPosts();
      this.postSub = this.service.getPostListener().subscribe((posts) => {
        this.posts = posts;
      });
    });
  }

  postLikeChanged(post: Post) {
    post.liked = !post.liked;
    post.liked ? post.postLikes++ : post.postLikes--;
    this.service.sendPostLike(post.postId);
  }

  private checkUserStatus() {
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
