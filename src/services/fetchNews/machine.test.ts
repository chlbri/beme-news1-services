import { voidNothing } from '@bemedev/fsf';
import { interpret } from '@bemedev/x-test';
import { afterAll, beforeAll, describe, test } from 'vitest';
import { advanceByTime } from '../../fixtures/advanceByTime';
import { useTestConfig } from '../../fixtures/config';
import machine from './machine';

const MEDIA_STACK_API_URL = 'MEDIA_STACK_API_URL';
const MEDIA_STACK_APIKEY = 'MEDIA_STACK_APIKEY';

function useEnvDefined() {
  beforeAll(() => {
    process.env = {
      MEDIA_STACK_APIKEY,
      MEDIA_STACK_API_URL,
    };
  });

  afterAll(() => {
    process.env = {};
  });
}

function useEnvUndefined() {
  beforeAll(() => {
    process.env = {};
  });
  afterAll(() => {
    process.env = {
      MEDIA_STACK_APIKEY,
      MEDIA_STACK_API_URL,
    };
  });
}

useTestConfig();

const { assign, promise, start, matches, stop, send, context } = interpret(
  machine.withConfig({
    actions: {
      escalateNoAPI_URL: voidNothing,
      escalateNoAPI_KEY: voidNothing,
    },
  }),
);

describe.only('Worflow 1', () => {
  useEnvDefined();
  test('Start the machine', () => {
    start();
    process.env.MEDIA_STACK_APIKEY; //?
  });

  test('', () => {
    matches('constructErrors');
  });

  test('Advance in time', () => advanceByTime(1000));
  // await new Promise(resolve => setTimeout(resolve, 1000));
  // send('QUERY');

  test('', () => {
    matches('idle');
    context('MEDIA_STACK_API_URL', ctx => ctx.API_URL);
  });
});
