import { CATEGORIES } from 'lib/entities/strings';
import { createMachine } from 'xstate';
import fetchNews from '../fetchNews/machine';
import { Context, Events } from './machine.types';

export const machine = createMachine(
  {
    schema: {
      context: {} as Context,
      events: {} as Events,
    },
    tsTypes: {} as import('./machine.typegen').Typegen0,
    predictableActionArguments: true,
    preserveActionOrder: true,
    context: { currentPage: '/', categories: CATEGORIES },
    id: 'main',
    initial: 'cache',
    states: {
      cache: {
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
        after: {
          timeToGetEnvironmentVariables: {
            target: '#main.cache',
            actions: ['forwardDefaultQuery'],
            internal: true,
          },
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
