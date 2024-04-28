import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PostUploadComponent } from './post-upload/post-upload.component';
import { PostListComponent } from './post-list/post-list.component';

export const routes: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'post-upload', component: PostUploadComponent },
  { path: 'post-list', component: PostListComponent },
];
