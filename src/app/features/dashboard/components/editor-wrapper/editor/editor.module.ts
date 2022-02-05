import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileSaverModule } from 'ngx-filesaver';
import { TuiImageEditorModule } from 'tui-image-editor-angular';

import { EditorComponent } from './editor.component';

@NgModule({
  declarations: [
    EditorComponent,
  ],
  imports: [
    CommonModule,
    FileSaverModule,
    TuiImageEditorModule,
  ],
  exports: [
    EditorComponent,
  ],
})
export class EditorModule { }
