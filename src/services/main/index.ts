import createInterpret from '@bemedev/x-interpret-react';
import { machine } from './machine';

const {
  sender,
  useSelector,
  createSelector,
  createContextSelector,
  start,
} = createInterpret(machine);

start();

export const search = sender('SEARCH');
