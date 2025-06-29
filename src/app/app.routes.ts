import { Routes } from '@angular/router';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditComponent } from './pages/edit/edit.component';
import { UploadComponent } from './pages/upload/upload.component';
import { FeedComponent } from './pages/feed/feed.component';
import { QrLoginComponent } from './pages/qr-login/qr-login.component';

export const routes: Routes = [
  { path: '', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit/:id', component: EditComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'qr-login', component: QrLoginComponent },
];
