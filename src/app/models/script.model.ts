export interface Script {
  loaded: boolean;
  src: string;
  downloadPromise?: Promise<void>;
}

export interface ScriptObject {
  imageEditor_MAIN: Script;
  imageEditor_POLYFILLS: Script;
  imageEditor_STYLES: Script;
}
