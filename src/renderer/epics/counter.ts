import { Action } from 'redux';
import { Observable } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { decrement, increment } from '../reducers/counter';

export const counter = (action$: Observable<unknown>) => action$.pipe(
  map((value) => value as Action),
  filter(action => action.type === increment.type),
  delay(5000),
  map(() => decrement())
);
