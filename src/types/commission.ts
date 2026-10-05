export interface CommissionRow {
  scheme: string;
  trail: string;
}

export interface CommissionCategory {
  category: string;
  rows: CommissionRow[];
}
