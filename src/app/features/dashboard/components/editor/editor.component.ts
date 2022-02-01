import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TuiImageEditorComponent } from 'tui-image-editor-angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit {
  @ViewChild(TuiImageEditorComponent) imageEditorComponent: TuiImageEditorComponent;

  ngAfterViewInit() {
    document.getElementsByTagName('tui-image-editor-menus-buttons-download')[0].addEventListener('click',(event) => {
      event.preventDefault();
    });
  }
}
