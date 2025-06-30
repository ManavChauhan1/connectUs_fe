import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';

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
  selectedMethod: 'qr' | 'barcode' = 'qr';

  constructor(private http: HttpClient, private router: Router) {}

  onCodeResult(result: string) {
    console.log('QR Code scanned:', result);
    if (this.scanned) return; // to prevent repeated calls
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
          this.scanned = false;
        }
      });
    } catch (e) {
      this.error = 'Code format invalid';
      this.scanned = false;
    }
  }

  switchMethod(method: 'qr' | 'barcode') {
    this.selectedMethod = method;
    this.scanned = false;
    this.error = '';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result as string;

      img.onload = async () => {
        try {
          const codeReader = new BrowserMultiFormatReader();
          const result = await codeReader.decodeFromImageElement(img);
          console.log('Scanned from image:', result.getText());
          this.onCodeResult(result.getText());
        } catch (err: any) {
          console.error('Image scan error:', err);
          this.error = 'No QR or Barcode found in the uploaded image';
        }
      };
    };

    reader.readAsDataURL(file);

    // Reset file input so same file can be re-uploaded
    (event.target as HTMLInputElement).value = '';
  }

}
