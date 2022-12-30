import { interpret } from '@bemedev/x-test';
import { beforeAll, describe, test } from 'vitest';
import { FetchNewsMachine } from './machine';

const { start, matches, send, context, parentSend, stop } =
  interpret(FetchNewsMachine);

beforeAll(() => {
  if (!global.fetch) {
    import('node-fetch').then(
      ({ default: fetch, Headers, Request, Response }) => {
        Object.assign(global, { fetch, Headers, Request, Response });
      },
    );
  }
});

describe.skipIf(process.env.GITHUB_ACTIONS !== 'true')(
  'Implemantation test',
  () => {
    test('#1 Start the machine', () => {
      start();
    });
  },
);
