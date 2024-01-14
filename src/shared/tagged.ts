// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Tagged<T extends string, A extends any[]> = {
	tag: T;
	args: A;
};

export type Tag<X> = X extends Tagged<infer T, unknown[]> ? T : never;

export type Args<X> = X extends Tagged<string, infer A> ? A : never;

export type Handler<T, R> = (...args: Args<T>) => R;

export type Constructor<T, V extends T> = Handler<V, T>;

type CataFnArgs<T, V, R> = V extends Tagged<string, infer A>
	? { [K in keyof A]: If<Equals<T, A[K]>, R, A[K]> }
	: never;

type CataFn<T, V, R> = (...args: CataFnArgs<T, V, R>) => R;

export type Union<V extends Tagged<string, unknown[]>[]> = V[number];

type CataArg<V extends Tagged<string, unknown[]>[], R> = {
	[K in V[number]['tag']]: CataFn<Union<V>, Extract<V[number], { tag: K }>, R>;
};

export type Cata<V extends Tagged<string, unknown[]>[]> = <R>(
	arg: CataArg<V, R>
) => (union: Union<V>) => R;

type If<P, T = true, F = false> = P extends true ? T : F;

type Extends<A, B> = A extends B ? true : false;

type And<A, B> = A extends true ? (B extends true ? true : false) : false;

type Equals<A, B> = And<Extends<A, B>, Extends<B, A>>;

type Contains<T extends any[], A> = T extends [infer Head, ...infer Rest]
	? Head extends A
		? true
		: Contains<Rest, A>
	: false;

type Recurses<A, B> = Contains<Args<A>, B>;

type RecursiveFoldFnArgs<T, V, A> = V extends Tagged<string, infer X>
	? { [K in keyof X]: If<Equals<T, X[K]>, A, X[K]> }
	: never;

type FoldFnArgs<T, V, R> = V extends Tagged<string, infer X>
	? { [K in keyof X]: If<Equals<T, X[K]>, R, X[K]> }
	: never;

type FoldFn<T, V, A, R> = If<
	Recurses<V, T>,
	(...args: RecursiveFoldFnArgs<T, V, A>) => A,
	(a: A, ...args: FoldFnArgs<T, V, R>) => R
>;

type FoldArg<V extends Tagged<string, unknown[]>[], A, R> = {
	[K in V[number]['tag']]: FoldFn<
		Union<V>,
		Extract<V[number], { tag: K }>,
		A,
		R
	>;
};

export type Fold<V extends Tagged<string, unknown[]>[]> = <A, R = A>(
	arg: FoldArg<V, A, R>
) => (a: A) => (union: Union<V>) => R;

export type FoldBack<V extends Tagged<string, unknown[]>[]> = <A>(
	arg: CataArg<V, A>
) => (union: Union<V>) => <R>(g: (a: A) => R) => R;

type MatchArg<V extends Tagged<string, unknown[]>[], R> = {
	[K in V[number]['tag']]: Handler<Extract<V[number], { tag: K }>, R>;
};

export type Match<V extends Tagged<string, unknown[]>[]> = <R>(
	arg: MatchArg<V, R>
) => (union: Union<V>) => R;

export const match =
  <V extends Tagged<string, unknown[]>[]>(): Match<V> =>
  (matcher) =>
  (union) =>
    (matcher as any)[union.tag](...union.args);
