export enum Side {
  X = "x",
  O = "o",
}

export const other = (side: Side): Side => {
  switch (side) {
    case Side.X:
      return Side.O;
    case Side.O:
      return Side.X;
  }
};
