import type { Cell } from "../types/Cell";

export interface Node {
  point: [number, number],
  value: Cell,
  children: Node[],
}