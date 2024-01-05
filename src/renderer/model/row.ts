export type Row = ["row", number];

export const Row = {
  create: (index: number): Row => ["row", index + 1],
  index: ([, row]: Row) => row - 1,
};
