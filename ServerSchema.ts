export interface ServerListColumn {
  Id: string;
  Value: string;
  SortBy?: string;
  CodeTemplate: string;
  HeaderCodeTemplate: string;
}

export interface ServerListDataItem {
  RowKey: string;
  RowValue: string;
  GroupName: string;
  Columns: ServerListColumn[];
  Interactions: any[];
  RelatedItems: any[];
}

export interface ServerList {
  Data: ServerListDataItem[];
  Total: number;
}

export type SummaryResponse = Array<SummaryRootObject>;

export interface SummaryRootObject {
  Label: string;
  ImageURL?: string;
  CodeTemplate?: string;
  Items: Array<SummaryItem>;
  Interactions?: any[];
  RelatedItems?: any[];
}

export interface SummaryItem {
  Id?: string;
  Label: string;
  Value: string;
  CodeTemplate?: string;
  LabelAlignment?: string;
  LabelFont?: string;
  LabelColor?: string;
  ValueAlignment?: string;
  ValueFont?: string;
}
