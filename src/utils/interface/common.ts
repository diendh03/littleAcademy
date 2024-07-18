export interface ElementDataLibrary {
  id: number;
  name: string;
}

export interface Recipe {
  id: number;
  result: string;
  elements: { name1: string; name2: string };
}

export interface ElementDataWorkspace {
  id: number;
  name: string;
  src: string;
  x: number;
  y: number;
  type: string;
}

export interface MergedElement {
  id: number;
  name: string;
  src: string;
  x: number;
  y: number;
}
