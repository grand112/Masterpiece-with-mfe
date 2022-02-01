import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { TuiImageEditorModule } from 'tui-image-editor-angular';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
  declarations: [
    DashboardComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    TuiImageEditorModule,
    TuiImageEditorModule,
  ]
})
export class DashboardModule { }
