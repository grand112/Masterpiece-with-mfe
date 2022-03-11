export interface IElements {
  [x: string]: IElement;
}

export interface IElement {
  src: string;
  loaded: boolean;
}
