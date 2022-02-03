import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { TuiImageEditorComponent } from 'tui-image-editor-angular';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit {
  private readonly editorTag = 'tui-image-editor';

  @ViewChild(TuiImageEditorComponent) imageEditorComponent: TuiImageEditorComponent;

  @Output() file: EventEmitter<File> = new EventEmitter();
  @Output() fileSaved: EventEmitter<void> = new EventEmitter();

  ngAfterViewInit(): void {
    this.addListenerToDownloadButton();
    this.addClassesToEditorElements();
    this.imageEditorComponent.loadImage = this.uploadFile.bind(this);
  }

  private isFileApiSupported(): boolean {
    return !!(window.File && window.FileList && window.FileReader);
  }

  private addListenerToDownloadButton(): void {
    document.getElementsByTagName('tui-image-editor-menus-buttons-download')[0].addEventListener('click', () => this.fileSaved.emit());
  }

  private addClassesToEditorElements(): void {
    document.getElementsByTagName(this.editorTag)[0].children[0].classList.add('editor-container');
    document.getElementsByTagName(this.editorTag)[0].children[0].children[0].classList.add('editor-header');
    document.getElementsByTagName(this.editorTag)[0].children[0].children[2].classList.add('editor-footer');
    document.getElementsByTagName(this.editorTag)[0].children[0].children[2].children[0].classList.add('editor-footer-buttons');
  }

  private uploadFile(file: File): void {
    if (!this.isFileApiSupported()) {
      alert('This browser does not support file-api');
      return;
    }

    this.file.emit(file);
    const imageUrl = URL.createObjectURL(file);
    this.loadFileToEditor(imageUrl);
  }

  private async loadFileToEditor(fileUrl: string): Promise<void> {
    if (this.imageEditorComponent.initializeImgUrl && fileUrl !== this.imageEditorComponent.initializeImgUrl) {
      URL.revokeObjectURL(this.imageEditorComponent.initializeImgUrl);
    }

    this.imageEditorComponent.initializeImgUrl = fileUrl;
    await this.imageEditorComponent.imageEditor.loadImageFromURL(this.imageEditorComponent.initializeImgUrl, 'fileName').then(() => {
      this.imageEditorComponent.imageChosen = true;
      this.imageEditorComponent.exitCropOnAction();
      this.imageEditorComponent.imageEditor.clearUndoStack();
      this.imageEditorComponent.imageEditor.clearRedoStack();
      this.imageEditorComponent.imageEditor._invoker.fire('executeCommand', 'Load');
      document.getElementsByClassName('editor-footer-buttons')[0].children[0].children[0].dispatchEvent(new Event('click'));
    });
  }
}
