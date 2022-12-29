import { assign } from '@xstate/immer';
import { createMachine, forwardTo, send } from 'xstate';
import { isDefined } from '~helpers/strings';
import { FetchNewsMachine as fetchNews } from '~machines/fetchNews/machine';
import { ArticlesResponse, CATEGORIES } from '~schemas';
import { Context, Events } from './machine.types';

export const SearchMachine = createMachine(
  {
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as {
        fetchNews: { data: ArticlesResponse };
      },
    },
    tsTypes: {} as import('./machine.typegen').Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
    context: { currentPage: '/', categories: CATEGORIES },
    id: 'main',
    initial: 'cache',
    states: {
      cache: {
        description:
          '[service_link](https://stately.ai/registry/editor/5671d57c-0419-4200-9d67-c3a500c1690d?machineId=81fb380e-0af3-428d-8947-3b07c1c59f66)',
        after: {
          200: {
            actions: 'forwardDefaultQuery',
          },
        },
        invoke: {
          src: 'fetchNews',
          id: 'fetchNews',
          onDone: [
            {
              target: 'work',
              actions: 'setNews',
            },
          ],
          onError: [
            {
              target: 'work',
            },
          ],
        },
      },
      work: {
        states: {
          search: {
            initial: 'inactive',
            states: {
              inactive: {},
              active: {
                initial: 'idle',
                states: {
                  loading: {
                    description:
                      '[service_link](https://stately.ai/registry/editor/5671d57c-0419-4200-9d67-c3a500c1690d?machineId=81fb380e-0af3-428d-8947-3b07c1c59f66)',
                    invoke: {
                      src: 'fetchNews',
                      id: 'fetchNews',
                      onDone: [
                        {
                          target: 'idle',
                          actions: 'setNews',
                        },
                      ],
                      onError: [
                        {
                          target: 'idle',
                        },
                      ],
                    },
                    on: {
                      QUERY: {
                        actions: 'forwardQuery',
                        description: 'Forward with parameters',
                      },
                    },
                  },
                  idle: {
                    always: {
                      target: 'loading',
                    },
                  },
                },
              },
              checking: {
                always: [
                  {
                    target: 'active',
                    cond: 'hasInput',
                  },
                  {
                    target: 'inactive',
                  },
                ],
              },
            },
            on: {
              INPUT: {
                target: '.checking',
                actions: 'setInput',
              },
            },
          },
        },
        type: 'parallel',
      },
    },
  },
  {
    actions: {
      forwardDefaultQuery: send('QUERY', { to: 'fetchNews' }),
      forwardQuery: forwardTo('fetchNews'),
      setNews: assign((ctx, { data }) => {
        ctx.articles = data.articles;
      }),
      setInput: assign((ctx, { input }) => {
        ctx.input = input;
      }),
    },
    guards: {
      hasInput: ({ input }) => isDefined(input),
    },
    services: {
      fetchNews,
    },
  },
);
