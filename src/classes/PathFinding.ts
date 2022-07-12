import Graph from "./Graph";
import type { Cell } from "../types/Cell";
import type { Node } from "../types/Node";
import Stack from '../classes/Stack';

export default class PathFinding {

  graph: Graph;
  start: Node;
  endPoint: [number, number];
  startPoint: [number, number];
  possibleMoves = [
    [-1, 0], // left
    [0, +1], // up
    [+1, 0], // right
    [0, -1], // down
  ];
  gridW: number;
  gridH: number;

  constructor(grid: Cell[][], start: [number, number], end: [number, number]) {
    this.gridW = grid[0].length;
    this.gridH = grid.length;
    this.start = this.buildNode(start, grid);
    this.startPoint = start;
    this.endPoint = end;
    this.graph = this.buildGraphFromGrid(this.start, grid, [this.start]);
  }

  buildNode(point: [number, number], grid: Cell[][]) :Node {
    const value = grid[point[1]][point[0]];
    return {
      point,
      value,
      children: []
    }
  }

  buildGraphFromGrid(node: Node, grid: Cell[][], visited: Node[], graph: Graph = new Graph()) :Graph {

    const [x, y] = node.point;
    node.children = this.possibleMoves
      .map((([incx, incy]) => [x + incx, y + incy]))
      .filter(([nx, ny]) => {
        // remove out of bounds
        // remove walls
        // remove already visited
        if(nx < 0 || nx >= this.gridW || ny < 0 || ny >= this.gridH || grid[ny][nx].wall) {
          return false;
        }

        return visited.findIndex((vis) => vis.point[0] === nx && vis.point[1] === ny) === -1;
      })
      .map(e => {
        const newNode = this.buildNode(e, grid);
        visited.push(newNode);
        graph.addVertex(newNode.point);
        graph.addEdge(node.point, newNode.point);
        return newNode;
      });

    node.children.forEach((child) => this.buildGraphFromGrid(child, grid, visited, graph));

    return graph;
  }

  aStar(): [number,number][] {
    console.log('aStar');
    return [];
  }

  idAstar(): [number,number][] {
    console.log('idAstar');
    return [];
  }

  breadthFirstSearch(): [number,number][] {
    console.log('breadthFirstSearch');
    return [];
  }

  depthFirstSearch(): [number,number][] {

    const { adjacentList } = this.graph;
    const stack = new Stack();
    const visited = new Map();

    adjacentList.forEach((edges, vertex) => {
      visited.set(vertex, false);
    });

    const path = [];
    const [firstPoint] = adjacentList.keys();

    stack.push(firstPoint);

    while(!stack.isEmpty()) {
      const vertex = stack.pop();

      if(vertex === this.endPoint) {
        return stack.items;    
      }

      if(visited.get(vertex)) {
        visited.set(vertex, true);
        stack.push(adjacentList.get(vertex))
      }
    }

    return [[]];

    return [path];
  }

  dijkstra(): [number,number][] {
    console.log('dijkstra');
    return [];
  }

  bestFirstSearch(): [number,number][] {
    console.log('bestFirstSearch');
    return [];
  }

  jumpPointSearch(): [number,number][] {
    console.log('jumpPointSearch');
    return [];
  }

  orthogonalJumpPointSearch(): [number,number][] {
    console.log('OrthogonalJumpPointSearch');
    return [];
  }

  trace() {
    console.log('trace');
  }

}