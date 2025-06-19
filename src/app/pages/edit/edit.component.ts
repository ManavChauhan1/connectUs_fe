import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  postId: string = '';
  postContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];

    this.api.getPostById(this.postId).subscribe({
      next: (data: any) => {
        this.postContent = data.content;
      },
      error: (err) => {
        console.error('Failed to fetch post:', err);
      }
    });
  }

  onUpdatePost() {
    if (!this.postContent.trim()) return;

    // console.log(this.postContent);

    this.api.updatePost(this.postId, {content : this.postContent}).subscribe({
      next: () => {
        alert('Post updated!');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Update error:', err);
      }
    });
  }

  onLogout() {
    this.api.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
