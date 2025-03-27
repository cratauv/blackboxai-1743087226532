import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
  }
];
