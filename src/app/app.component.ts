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
        const currentRoute = this.router.url;
        // console.log(this.router.url);
        if (res && res.user && res.user._id) {
          if(currentRoute === '/' || currentRoute === '/login')
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
