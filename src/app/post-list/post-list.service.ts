import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, of, Subject, Subscription } from 'rxjs';
import { Post } from './post.mode';

@Injectable({
  providedIn: 'root',
})
export class PostListService implements OnDestroy {
  private posts: Post[] = [];
  private postsSubject = new Subject<Post[]>();
  private postsSubscription: Subscription = new Subscription();

  constructor(private http: HttpClient) {}

  ngOnDestroy(): void {
    this.postsSubscription.unsubscribe();
  }

  getPostListener() {
    return this.postsSubject.asObservable();
  }

  getPosts() {
    this.postsSubscription = this.http
      .get('http://localhost:3001/api/post', { withCredentials: true })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .pipe(
        map((posts: any) =>
          posts.map(
            (post: any): Post => ({
              location: post.location,
              postContent: post.post_content,
              postId: post.post_id,
              // postedTime:
              //   this.calculateDaysDifferenceFromTimestamp(post.posted_time) +
              //   ' days ago',
              postedTime:post.posted_time,
              postImage: post.post_image,
              postLikes: post.post_likes,
              userName: post.user_name,
              userProfile: post.user_profile,
              liked: post.liked,
            })
          )
        )
      )
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.postsSubject.next([...this.posts]);
      });
  }

  private calculateDaysDifferenceFromTimestamp = (date: string): number => {
    const dateFromTimestamp = new Date(date);
    const currentDate = new Date();
    const differenceInMilliseconds =
      currentDate.getTime() - dateFromTimestamp.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.floor(differenceInDays);
  };

  sendPostLike(postId: string) {
    this.http
      .post(
        'http://localhost:3001/api/post/like',
        { post_id: postId },
        { withCredentials: true }
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .subscribe((updatedPost: any) => {});
  }
}
