import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { PostListService } from './post-list.service';
import { Post } from './post.mode';
import { map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [MatIconModule],
  providers: [PostListService],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit {
  constructor(private service: PostListService) {}

  posts: Post[] = [];

  ngOnInit(): void {
    this.service.getPosts();
    this.service.getPostListener().subscribe((posts) => {
      console.log(posts);
      this.posts = posts;
    });
  }
  postLikeChanged(post: Post) {
    post.liked = !post.liked;
    post.liked ? post.postLikes++ : post.postLikes--;
    this.service.sendPostLike(post.postId);
  }

  calculateTime(postedTime: string): string {
    const currentTime = new Date().getTime();
    const postTime = new Date(postedTime).getTime();
    const differenceInMs = currentTime - postTime;
    const differenceInSeconds = differenceInMs / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    if (differenceInMinutes < 1) {
      return `Just now`;
    } else if (differenceInMinutes < 60) {
      return `${Math.floor(differenceInMinutes)} minutes ago`;
    } else if (differenceInHours < 24) {
      return `${Math.floor(differenceInHours)} hours ago`;
    } else {
      return `${Math.floor(differenceInDays)} days ago`;
    }
  }
}