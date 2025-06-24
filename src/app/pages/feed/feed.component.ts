import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-feed',
  imports: [CommonModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
  posts: any[] = [];
  currentUser: any;
  loading = true;
  error = '';
  baseUrl = environment.apiUrl;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getFeed().subscribe({
      next: (res) => {
        this.posts = res.posts;
        this.currentUser = res.user;
        this.loading = false;
      },
      error: (err) => {
        console.error('Feed fetch error', err);
        this.error = 'Failed to load feed.';
        this.loading = false;
      }
    });
  }

  toggleLike(post: any): void {
    this.api.likePost(post._id).subscribe({
      next: (res) => {
        post.likes = [...res.likes];
      },
      error: (err) => {
        console.error('Like error', err);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/default.png';
  }

  goToProfile(): void {
  this.router.navigate(['/profile']);
}

editProfile(): void {
  this.router.navigate(['/edit-profile']); // Or any route you use for editing
}

logout(): void {
  this.api.logout().subscribe({
    next: () => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    },
    error: () => {
      this.router.navigate(['/login']);
    }
    });
  }
}
