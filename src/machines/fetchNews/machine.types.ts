import type { Category, NewsResponse } from '~schemas';
import type { ERRORS } from './constants';

export type FetchNewsQuery = {
  categories?: Category[];
  offset?: number;
  limit?: number;
};

type Errors = typeof ERRORS;

export type Context = {
  API_URL?: string;
  API_KEY?: string;
  URL?: string;
  response?: Response;
  json?: unknown;
  news?: NewsResponse['news'];
  pagination?: NewsResponse['pagination'];
  categories?: string;
  _errors?: Errors['object'];
};

export type Events = {
  type: 'QUERY';
} & FetchNewsQuery;
