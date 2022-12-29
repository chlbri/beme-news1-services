import { interpret } from '@bemedev/x-test';
import { describe, test } from 'vitest';
import { FetchNewsMachine } from './machine';

const { start, matches, send, context, parentSend, stop } =
  interpret(FetchNewsMachine);

describe.skipIf(process.env.GITHUB_ACTIONS !== 'true')(
  'Implemantation test',
  () => {
    test('#1 Start the machine', () => {
      start();
    });
  },
);
