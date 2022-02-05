import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
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

  @Output() fileSaved = new EventEmitter<File>();
  @Output() infoMessage = new EventEmitter<string>();

  constructor(private fileSaver: FileSaverService) { }

  ngAfterViewInit(): void {
    this.addClassesToEditorElements();
    this.appendSaveButton();
    this.appendNewImageButton();
    this.replaceDownloadButton();
    this.appendDownloadButton();
    this.imageEditorComponent.loadImage = this.uploadFile.bind(this);
  }

  private appendDownloadButton(): void {
    const downloadButton = document.createElement('div');
    downloadButton.innerHTML = '<img src="assets/download.png" width="27" height="25">';
    downloadButton.classList.add('editor-download-button');
    downloadButton.addEventListener('click', () => this.downloadFile());
    document.getElementsByTagName(this.editorTag)[0].children[0].children[0].children[0].children[0].children[2].
      insertAdjacentElement('afterend', downloadButton);
  }

  private downloadFile(): void {
    const dataURL = this.imageEditorComponent.imageEditor.toDataURL();
    const blob = this.dataUrlToBlob(dataURL);
    this.fileSaver.save(blob);
  }

  private replaceDownloadButton(): void {
    const downloadButton = document.getElementsByClassName('tie-btn-download')[0];
    downloadButton.classList.add('editor-preview-button');
    downloadButton.innerHTML = '<img src="assets/preview.png" width="28" height="29">';
  }

  private appendSaveButton(): void {
    const saveButton = document.createElement('div');
    saveButton.innerHTML = '<img src="assets/save.png" width="31" height="31">';
    saveButton.classList.add('editor-save-button');
    saveButton.addEventListener('click', () => this.saveFile());
    document.getElementsByTagName(this.editorTag)[0].children[0].children[0].children[0].children[0].children[0].
      insertAdjacentElement('beforebegin', saveButton);
  }

  private appendNewImageButton(): void {
    const newImageButton = document.createElement('div');
    newImageButton.innerHTML = '<img src="assets/start.png" width="35" height="33">';
    newImageButton.classList.add('editor-start-button');
    newImageButton.addEventListener('click', () => this.uploadFile(this.defaultFile));
    document.getElementsByTagName(this.editorTag)[0].children[0].children[0].children[0].children[0].children[0].
      insertAdjacentElement('beforebegin', newImageButton);
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const { groups: { mime, base64data } } = /data:(?<mime>.+);base64,(?<base64data>.+)/.exec(dataUrl);

    const byteCharacters = atob(base64data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mime });
  }

  private saveFile(): void {
    const dataURL = this.imageEditorComponent.imageEditor.toDataURL();
    const blob = this.dataUrlToBlob(dataURL);
    const file = new File([blob], 'fileName');
    const infoMessage = 'Obraz został pomyślnie zapisany w twojej galerii';
    this.infoMessage.emit(infoMessage);
    this.fileSaved.emit(file);
  }

  private isFileApiSupported(): boolean {
    return !!(window.File && window.FileList && window.FileReader);
  }

  private addClassesToEditorElements(): void {
    const editor = document.getElementsByTagName(this.editorTag)[0].children[0];
    const editorHeader = editor.children[0];
    const editorFooter = editor.children[2];
    const editorFooterButtons = editorFooter.children[0];
    const editorFirstButtonSection = editorHeader.children[0].children[0];

    editor.classList.add('editor-container');
    editorHeader.classList.add('editor-header');
    editorFooter.classList.add('editor-footer');
    editorFooterButtons.classList.add('editor-footer-buttons');
    editorFirstButtonSection.classList.add('editor-first-button-section');
  }

  private uploadFile(file: File): void {
    if (!this.isFileApiSupported()) {
      const errorMessage = 'Obraz w wybranym formacie nie jest obsługiwany przez edytor. Wybierz plik w innym fomacie.';
      this.infoMessage.emit(errorMessage);
    }

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
