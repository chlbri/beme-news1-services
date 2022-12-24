import { createMachine } from 'xstate';
import { FetchNewsMachine as fetchNews } from '~machines/fetchNews/machine';
import { CATEGORIES, NewsResponse } from '~schemas';
import { Context, Events } from './machine.types';

export const MainMachine = createMachine(
  {
    schema: {
      context: {} as Context,
      events: {} as Events,
      services: {} as {
        fetchNews: { data: NewsResponse };
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
        entry: 'forwardDefaultQuery',
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
                      SEARCH: {
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
                    target: 'inactive',
                    cond: 'isInputIsEmpty',
                  },
                  {
                    target: 'active',
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
    actions: {},
    services: {
      fetchNews,
    },
  },
);
