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

  printGraph() {
    const get_keys = this.adjacentList.keys();

    for (const i of get_keys) {
      const get_values = this.adjacentList.get(i);
      let conc = "";

      if(get_values) {
        for (const j of get_values) {
          conc += j + " ";
        }
      }

      console.log(i + " -> " + conc);
    }
  }

}