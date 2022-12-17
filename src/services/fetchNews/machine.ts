import { assign } from '@xstate/immer';
import { createMachine } from 'xstate';
import { escalate } from 'xstate/lib/actions';
import { NewsResponse, newsResponseSchema } from '~entities/objects';
import { ERRORS } from './constants';
import { Context, Events } from './machine.types';

const machine = createMachine(
  {
    id: 'fetchNews',
    initial: 'environment',
    states: {
      environment: {
        initial: 'API_URL',
        states: {
          API_URL: {
            invoke: {
              src: 'get_API_URL',
              onDone: {
                target: 'API_KEY',
                actions: 'assignAPI_URL',
              },
              onError: {
                target: '#error',
                actions: ['escalateNoAPI_URL'],
              },
            },
          },
          API_KEY: {
            invoke: {
              src: 'get_API_KEY',
              onDone: {
                target: '#constructErrors',
                actions: 'assignAPI_KEY',
              },
              onError: {
                target: '#error',
                actions: ['escalateNoAPI_KEY'],
              },
            },
          },
        },
      },
      constructErrors: {
        id: 'constructErrors',
        always: {
          target: 'idle',
          actions: ['constructErrors'],
        },
      },
      idle: {
        id: 'idle',
        on: {
          QUERY: {
            target: 'fetch',
            actions: ['concatCategories', 'buildURL'],
          },
        },
      },
      fetch: {
        invoke: {
          src: 'fetchNews',
          id: 'fetch',
          onDone: { target: 'json', actions: 'assignResponse' },
          onError: {
            target: 'error',
            actions: 'escaladeFetchError',
          },
        },
      },
      json: {
        invoke: {
          src: 'json',
          id: 'json',
          onDone: { target: 'zod', actions: 'assignJSON' },
          onError: {
            target: 'error',
            actions: 'escaladeJsonError',
          },
        },
      },
      zod: {
        invoke: {
          src: 'zod',
          id: 'zod',
          onDone: {
            target: 'success',
            actions: ['assignNews', 'assignPagination'],
          },
          onError: {
            target: 'error',
            actions: 'escaladeZodError',
          },
        },
      },
      success: {
        type: 'final',
        data: context => ({
          news: context.news,
          pagination: context.pagination,
        }),
      },
      error: {
        id: 'error',
        type: 'final',
      },
    },
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as {
        get_API_URL: { data: string };
        get_API_KEY: { data: string };
        fetchNews: { data: Response };
        json: { data: unknown };
        zod: { data: NewsResponse };
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    tsTypes: {} as import('./machine.typegen').Typegen0,
  },
  {
    actions: {
      constructErrors: assign(context => {
        context._errors = ERRORS.object;
      }),
      assignAPI_URL: assign((context, { data }) => {
        context.API_URL = data;
      }),
      assignAPI_KEY: assign((context, { data }) => {
        context.API_KEY = data;
      }),
      concatCategories: assign((context, { categories }) => {
        context.categories = categories?.join(',');
      }),
      buildURL: assign(context => {
        let url = `${context.API_URL}?access_key=${context.API_KEY}`;
        const { categories, offset, limit } = context;
        if (categories) url += `&keywords=${categories}`;
        if (offset) url += `&offset=${offset}`;
        if (limit) url += `&limit=${limit}`;
        context.URL = url;
      }),
      assignResponse: assign((context, { data }) => {
        context.response = data;
      }),
      assignJSON: assign((context, { data }) => {
        context.json = data;
      }),
      assignNews: assign((context, { data }) => {
        context.news = data.news;
      }),
      assignPagination: assign((context, { data }) => {
        context.pagination = data.pagination;
      }),

      // #region Errors
      //TODO: test the escalations
      escaladeFetchError: escalate(({ _errors }) => _errors?.FETCH_ERROR),
      escaladeJsonError: escalate(({ _errors }) => _errors?.JSON_ERROR),
      escaladeZodError: escalate(({ _errors }) => _errors?.ZOD_ERROR),
      escalateNoAPI_KEY: escalate(({ _errors }) => _errors?.API_KEY_ERROR),
      escalateNoAPI_URL: escalate(({ _errors }) => _errors?.API_URL_ERROR),
      // #endregion
    },
    services: {
      get_API_URL: async () => {
        const out = process.env.MEDIA_STACK_API_URL;
        const empty = !out || out === 'undefined';
        out; //?
        if (empty) throw new Error('No API_URL');

        return out;
      },

      get_API_KEY: async () => {
        const out = process.env.MEDIA_STACK_APIKEY;
        const empty = !out || out === 'undefined';
        if (empty) throw new Error('No API_KEY');

        return out;
      },

      fetchNews: async context => {
        global.fetch; //?
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const response = await fetch(context.URL!);
        if (!response.ok) throw new Error('not OK');
        return response;
      },

      json: async ({ response }) => {
        const data = await response?.json();
        // if (!data) throw new Error('no data');
        return data;
      },

      zod: ({ json }) => newsResponseSchema.parseAsync(json),
    },
  },
);

export default machine;
