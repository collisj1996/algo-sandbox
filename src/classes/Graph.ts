export default class Graph {

  numberOfVertices: number;
  adjacentList: Map<[number, number], Array<[number, number]>>;

  constructor() {
    this.numberOfVertices = 0;
    this.adjacentList = new Map();
  }

  addVertex(vertex: [number, number]) {
    this.adjacentList.set(vertex, []);
    this.numberOfVertices++;
  }

  addEdge(srcVertex: [number, number], destVertex: [number, number]) {
    this.adjacentList.get(srcVertex)?.push(destVertex);
    this.adjacentList.get(destVertex)?.push(srcVertex);
  }

}