export interface PaginationQueryProps {
  page: number;
  perPage?: number;
}

export interface PaginationData<T> {
  items: T[];
  meta: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
    first: number;
    last: number;
  };
}

export interface PaginationProps {
  items: number;
  pages: number;
  current: number;
  perPage: number;
  prev: number | null;
  next: number | null;
}
