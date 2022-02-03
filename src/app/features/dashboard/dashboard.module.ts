import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TuiImageEditorModule } from 'tui-image-editor-angular';

import { EditorComponent } from './components/editor-wrapper/editor/editor.component';
import { EditorWrapperComponent } from './components/editor-wrapper/editor-wrapper.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [
    EditorComponent,
    DashboardComponent,
    EditorWrapperComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    DashboardRoutingModule,
    TuiImageEditorModule,
    MatSidenavModule,
  ],
})
export class DashboardModule { }
