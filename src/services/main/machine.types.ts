import { Category } from 'lib/entities/strings';

export type Context = {
  currentPage: string;
  input?: string;
  categories: Category[];
};

export type Events =
  | { type: 'INPUT' }
  | { type: 'SEARCH' }
  | { type: 'NAVIGATE'; page: string };
