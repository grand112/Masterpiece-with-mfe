import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditorWrapperComponent } from './components/editor-wrapper/editor-wrapper.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UsersComponent } from './components/users/users.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'profile',
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          {
            path: ':id',
            component: ProfileComponent,
          },
        ],
      },
      {
        path: 'gallery',
        component: GalleryComponent,
        children: [
          {
            path: ':id',
            component: GalleryComponent,
          },
        ],
      },
      {
        path: 'editor',
        component: EditorWrapperComponent,
        children: [
          {
            path: ':id',
            component: EditorWrapperComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
