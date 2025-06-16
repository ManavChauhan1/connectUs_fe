import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: any = null;
  createPostContent = '';
  loading = true;
  error = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private http: HttpClient 
  ) {}

  ngOnInit(): void {
    this.api.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onCreatePost(): void {
    if (!this.createPostContent.trim() || !this.user) return;

    this.api.createPost({ content: this.createPostContent }).subscribe({
      next: (res) => {
        this.user.posts.unshift(res.post);
        this.createPostContent = '';
      },
      error: (err) => {
        console.error('Failed to create post:', err);
      }
    });
  }

  toggleLike(post: any) {
    this.api.likePost(post._id).subscribe({
      next: (res) => {
        // Backend returns updated likes array
        post.likes = res.likes;
      },
      error: (err) => {
        console.error('Like toggle error:', err);
      }
    });
  }

  onEdit(postId: string): void {
    this.router.navigate(['/edit', postId]);
  }

  onLogout(): void {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']) // fallback
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('default.png')) {
      img.src = '/default.png';
    }
  }
  //Handling Image Upload
  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('profilepic', file);

    this.http.post<{ filename: string }>('/upload-profile', formData).subscribe({
      next: (res) => {
        this.user.profilepic = res.filename;
        alert('Profile image updated!');
      },
      error: (err) => {
        console.error('Upload error:', err);
        alert('Failed to upload image.');
      }
    });
  }

  
}


