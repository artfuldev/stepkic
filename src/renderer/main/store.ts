import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./reducers/counter";
import { createEpicMiddleware } from 'redux-observable';
import { counter } from "./epics/counter";

const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    counter: counterReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware)
});

epicMiddleware.run(counter);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
