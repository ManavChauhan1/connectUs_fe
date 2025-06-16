import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit{
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(){
    this.api.checkAuth().subscribe({
      next: (res: any) => {
        if (res && res.user && res.user._id) {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        // Token invalid or not present
        this.router.navigate(['/']);
      }
    });
  }
}
