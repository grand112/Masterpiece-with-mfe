import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { combineLatest, EMPTY, fromEvent,Observable } from 'rxjs';
import { IElement, IElements } from 'src/app/models/element.model';

@Injectable({
  providedIn: 'root',
})
export class ElementLoaderService {
  private galleryUrl = 'https://image-gallery-mfe.web.app';
  private editorUrl = 'https://image-editor-mfe.web.app';

  private elements: IElements = {
    galleryMain: {
      src: `${this.galleryUrl}/main.js`,
      loaded: false,
    },
    galleryStyles: {
      src: `${this.galleryUrl}/styles.css`,
      loaded: false,
    },
    editorMain: {
      src: `${this.editorUrl}/main.js`,
      loaded: false,
    },
    editorStyles: {
      src: `${this.editorUrl}/styles.css`,
      loaded: false,
    },
  };

  constructor(@Inject(DOCUMENT) private document: Document) { }

  loadElement(elementName: string): Observable<[Event, Event]> {
    return combineLatest([this.loadScript(this.elements[`${elementName}Main`]), this.loadStyles(this.elements[`${elementName}Styles`])]);
  }

  private loadScript(element: IElement): Observable<Event> {
    if (!element.loaded) {
      const scriptElement = this.document.createElement('script');
      scriptElement.src = element.src;
      scriptElement.setAttribute('defer', 'defer');
      this.document.body.appendChild(scriptElement);
      element.loaded = true;
      return fromEvent(scriptElement, 'load');
    } else {
      return EMPTY;
    }
  }

  private loadStyles(element: IElement): Observable<Event> {
    if (!element.loaded) {
      const linkElement = this.document.createElement('link');
      linkElement.href = element.src;
      linkElement.rel = 'stylesheet';
      this.document.body.appendChild(linkElement);
      element.loaded = true;
      return fromEvent(linkElement, 'onload');
    } else {
      return EMPTY;
    }
  }
}
