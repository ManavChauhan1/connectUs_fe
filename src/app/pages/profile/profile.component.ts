import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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
  baseUrl = environment.apiUrl;
  qrCode: string = '';
  barcode: string = '';

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
        this.fetchQRCodeAndBarcode();;
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

  onDeleteProfile():void{
    if(confirm('Are you sure you want to delete your profile? This action is irreversible')){
      this.api.deleteProfile().subscribe({
        next: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
          alert('Account Deleted..');
        },
        error: (err) => {
          console.log(err);
          alert('Failed to delete account.');
        }
      })
    }
  }

  goToFeed():void{
    this.router.navigate(['/feed']);
  }

    // Fetch QR/Bar code
  fetchQRCodeAndBarcode(): void {
    const userId = this.user?._id;
    if (!userId) return;

    this.http.post<{ qrCode: string, barcode: string }>(`${this.baseUrl}/generate-qr`, { userId }).subscribe({
      next: (res) => {
        this.qrCode = res.qrCode;
        this.barcode = res.barcode;
        console.log("Bar Code is:", this.barcode);
        console.log("QR Code is:", this.qrCode);
      },
      error: (err) => {
        console.error('QR/Barcode fetch failed:', err);
      }
    });
  }

  downloadQR(): void {
    if (!this.qrCode) return;
    const a = document.createElement('a');
    a.href = this.qrCode;
    a.download = 'login-qr-code.png';
    a.click();
  }

  downloadBarcode() {
  const link = document.createElement('a');
  link.href = this.barcode;
  link.download = 'login-barcode.png';
  link.click();
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
      next: () => {this.router.navigate(['/login'])
              localStorage.removeItem('token');
      },
      error: () => this.router.navigate(['/login']) // fallback
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/default.png';
  }
  //Handling Image Upload
  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('profilepic', file);

    this.api.uploadProfilePic(formData).subscribe({
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