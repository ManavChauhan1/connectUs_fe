import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-qr-login',
  templateUrl: './qr-login.component.html',
  imports: [ZXingScannerModule, CommonModule]
})
export class QrLoginComponent {
  baseUrl = environment.apiUrl;
  error = '';
  scanned = false;

  constructor(private http: HttpClient, private router: Router) {}

  onCodeResult(result: string) {
    console.log('QR Code scanned:', result);
    if (this.scanned) return; // prevent repeated calls
    this.scanned = true;

    try {
      const qrData = JSON.parse(result);
      const { userId, token } = qrData;

      if (!userId || !token) {
        this.error = 'Invalid QR data';
        this.scanned = false;
        return;
      }

      this.http.post<{ token: string }>(`${this.baseUrl}/qr-login`, { userId, token }).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/profile']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.error = err.error?.message || 'Invalid QR Code';
          this.scanned = false; // allow retry
        }
      });
    } catch (e) {
      this.error = 'QR Code format invalid';
      this.scanned = false;
    }
  }
}
