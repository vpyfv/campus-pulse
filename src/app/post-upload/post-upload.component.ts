import { Component } from '@angular/core';
import { PostUploadService } from './post-upload.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-upload',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-upload.component.html',
  styleUrl: './post-upload.component.css',
  providers: [PostUploadService],
})
export class PostUploadComponent {
  constructor(private service: PostUploadService) {}
  postForm = new FormGroup({
    postDetails: new FormControl('', Validators.required),
    image: new FormControl(null),
    location: new FormControl('', Validators.required),
  });

  imageSr: string = '';

  onSubmit() {
    console.log(this.postForm);
    const formData = new FormData();
    formData.append('postDetails', this.postForm.value.postDetails!);
    formData.append('location', this.postForm.value.location!);
    formData.append('image', this.postForm.value.image!);
    this.service.getNewPostData(formData);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageSr = URL.createObjectURL(file);
      this.postForm.patchValue({ image: file });
    }
  }

  clearForm() {
    this.imageSr = '';
    this.postForm.reset();
  }
}
