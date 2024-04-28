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
      this.posts = posts;
    });
  }
  postLikeChanged(post: Post) {
    post.liked = !post.liked;
    post.liked ? post.postLikes++ : post.postLikes--;
    this.service.sendPostLike(post.postId);
  }
}
