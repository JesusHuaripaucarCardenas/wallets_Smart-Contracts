import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' },
];
