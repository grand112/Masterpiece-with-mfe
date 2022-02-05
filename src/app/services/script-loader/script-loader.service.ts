import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Script, ScriptObject } from 'src/app/models/script.model';

@Injectable({
  providedIn: 'root',
})
export class ScriptLoaderService {
  private readonly imageEditorUrl = 'https://image-editor-mfe.web.app';
  private scriptsToLoad: ScriptObject = {
    imageEditor_MAIN: {
      loaded: false,
      src: `${this.imageEditorUrl}/main.js`,
    },
    imageEditor_POLYFILLS: {
      loaded: false,
      src: `${this.imageEditorUrl}/polyfills.js`,
    },
    imageEditor_STYLES: {
      loaded: false,
      src: `${this.imageEditorUrl}/styles.js`,
    },
  };

  constructor(@Inject(DOCUMENT) private document: Document) { }

  loadImageEditor(): Promise<void[]> {
    return Promise.all([
      this.loadScript(this.scriptsToLoad.imageEditor_POLYFILLS),
      this.loadScript(this.scriptsToLoad.imageEditor_MAIN),
      this.loadStyles(this.scriptsToLoad.imageEditor_STYLES, '#editor-style'),
    ]);
  }

  private loadScript(scriptToLoad: Script): Promise<void> {
    if (scriptToLoad.loaded) {
      return Promise.resolve();
    }

    if (!scriptToLoad.downloadPromise) {
      scriptToLoad.downloadPromise = new Promise((resolve) => {
        const script: HTMLScriptElement = this.document.createElement('script');
        script.src = scriptToLoad.src;
        script.type = 'text/javascript';
        this.document.body.appendChild(script);
        script.addEventListener('load', () => {
          scriptToLoad.loaded = true;
          resolve();
        });
      });
    }

    return scriptToLoad.downloadPromise;
  }

  private loadStyles(scriptToLoad: Script, selector: string): Promise<void> {
    if (scriptToLoad.loaded) {
      return Promise.resolve();
    }

    if (!scriptToLoad.downloadPromise) {
      scriptToLoad.downloadPromise = new Promise((resolve) => {
        const script: HTMLScriptElement = this.document.createElement('script');
        script.src = scriptToLoad.src;
        script.type = 'text/javascript';
        const element = this.document.head.querySelector(selector);
        this.document.head.replaceChild(script, element);
        this.document.body.appendChild(script);
        script.addEventListener('load', () => {
          scriptToLoad.loaded = true;
          resolve();
        });
      });
    }

    return scriptToLoad.downloadPromise;
  }
}
