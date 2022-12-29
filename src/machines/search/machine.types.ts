import { FetchArticleQuery } from '~machines/fetchNews/machine.types';
import { ArticlesResponse, Category } from '~schemas';

export type Context = {
  currentPage: string;
  input?: string;
  categories: Category[];
  articles?: ArticlesResponse['articles'];
};

export type Events =
  | { type: 'INPUT'; input: string }
  | ({ type: 'QUERY' } & FetchArticleQuery)
  | { type: 'NAVIGATE'; page: string };
