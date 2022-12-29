import { FetchNewsQuery } from '~machines/fetchNews/machine.types';
import { Category, NewsResponse } from '~schemas';

export type Context = {
  currentPage: string;
  input?: string;
  categories: Category[];
  news?: NewsResponse['news'];
};

export type Events =
  | { type: 'INPUT'; input: string }
  | ({ type: 'QUERY' } & FetchNewsQuery)
  | { type: 'NAVIGATE'; page: string };
