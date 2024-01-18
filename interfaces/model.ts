export interface ColumnModel {
  id?: string;
  title?: string;
  modelName?: string;
  comment?: string;
  field: string;
  type: string;
  unique?: boolean;
  readonly?: boolean;
  default?: any;
  select?: boolean;
  ref?: string;
  sortColumn: number;
  [key: string]: any | undefined;
}

export type AlignType = "start" | "end" | "left" | "right" | "center" | "justify" | "match-parent";

export interface ColumnViewModel {
  field: string;
  width?: number;
  title?: string;
  align?: AlignType;
  renderItem?: (item: any, index: number) => React.ReactNode;
}
