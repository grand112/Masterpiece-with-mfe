import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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

  @Input() defaultFile: File;

  @Output() file: EventEmitter<File> = new EventEmitter();
  @Output() fileSaved: EventEmitter<void> = new EventEmitter();
  @Output() errorMessage: EventEmitter<string> = new EventEmitter();

  ngAfterViewInit(): void {
    this.addListenerToDownloadButton();
    this.addClassesToEditorElements();
    this.appendNewImageButton();
    this.imageEditorComponent.loadImage = this.uploadFile.bind(this);
  }

  private appendNewImageButton(): void {
    const newImageButton = document.createElement('div');
    newImageButton.innerHTML = '<img src="assets/start.png" width="36" height="36">';
    newImageButton.classList.add('editor-start-button');
    newImageButton.addEventListener('click', () => this.uploadFile(this.defaultFile));
    document.getElementsByTagName(this.editorTag)[0].children[0].children[0].children[0].children[0].children[0].
      insertAdjacentElement('beforebegin', newImageButton);
  }

  private isFileApiSupported(): boolean {
    return !!(window.File && window.FileList && window.FileReader);
  }

  private addListenerToDownloadButton(): void {
    document.getElementsByTagName('tui-image-editor-menus-buttons-download')[0].addEventListener('click', () => this.fileSaved.emit());
  }

  private addClassesToEditorElements(): void {
    const editor = document.getElementsByTagName(this.editorTag)[0].children[0];
    const editorHeader = editor.children[0];
    const editorFooter = editor.children[2];
    const editorFooterButtons = editorFooter.children[0];
    const editorFirstButtonSection = editorFooterButtons.children[0];

    editor.classList.add('editor-container');
    editorHeader.classList.add('editor-header');
    editorFooter.classList.add('editor-footer');
    editorFooterButtons.classList.add('editor-footer-buttons');
    editorFirstButtonSection.classList.add('editor-first-button-section');
  }

  private uploadFile(file: File): void {
    if (!this.isFileApiSupported()) {
      const errorMessage = 'Obraz w wybranym formacie nie jest obsługiwany przez edytor. Wybierz plik w innym fomacie.';
      this.errorMessage.emit(errorMessage);
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
    });
  }
}
