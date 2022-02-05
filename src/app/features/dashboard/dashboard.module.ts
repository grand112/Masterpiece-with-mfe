import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { EditorModule } from './components/editor-wrapper/editor/editor.module';
import { EditorWrapperComponent } from './components/editor-wrapper/editor-wrapper.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    EditorWrapperComponent,
  ],
  imports: [
    CommonModule,
    EditorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    DashboardRoutingModule,
    MatSidenavModule,
  ],
})
export class DashboardModule { }
