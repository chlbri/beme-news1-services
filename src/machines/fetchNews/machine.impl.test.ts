import { interpret } from '@bemedev/x-test';
import { beforeAll, describe, test } from 'vitest';
import { FetchNewsMachine } from './machine';

const { start, matches, send, context, parentSend, stop } =
  interpret(FetchNewsMachine);

beforeAll(() => {
  global.fetch = (input, init) =>
    import('node-fetch').then(({ default: fetch }) =>
      fetch(input as any, init as any),
    ) as any;
});

describe.skipIf(process.env.GITHUB_ACTIONS !== 'true')(
  'Implemantation test',
  () => {
    test('#1 Start the machine', () => {
      start();
    });
  },
);
