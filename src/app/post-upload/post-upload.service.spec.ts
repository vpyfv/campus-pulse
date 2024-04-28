import { TestBed } from '@angular/core/testing';

import { PostUploadService } from './post-upload.service';

describe('PostUploadService', () => {
  let service: PostUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
