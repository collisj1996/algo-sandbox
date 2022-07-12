<script lang="ts">

import { defineComponent, reactive, toRefs } from 'vue'
import type { Cell } from '../../types/Cell';
import testData from '../../data/testData';
import PathFinding from '../../classes/PathFinding';

export default defineComponent({
  name: 'PathFindingGrid',
  components: {},
  setup() {

    const state = reactive({
      cellsCanvas: null as HTMLCanvasElement | HTMLElement | null,
      cellsCanvasContext: null as CanvasRenderingContext2D | null,
      linesCanvas: null as HTMLCanvasElement | HTMLElement | null,
      linesCanvasContext: null as CanvasRenderingContext2D | null,
      vueCanvasWidth: 500 as number,
      vueCanvasHeight: 500 as number,
      cellGrid: null as Cell[][] | null,
      gridStep: 20 as number,
      paintMode: true as boolean,
      startCell: null as Cell | null,
      startCellPoint: null as [number, number] | null,
      endCell: null as Cell | null,
      endCellPoint: null as [number, number] | null,
      pathFinding: null as PathFinding | null,
      delay: 50 as number,
    });

    return { ...toRefs(state) };
  },
  mounted() {
    this.init();
    this.pathFinding = new PathFinding(this.cellGrid, this.startCellPoint, this.endCellPoint);
    const path = this.pathFinding.depthFirstSearch();
    this.drawPath(path);
  },
  methods: {
    init() {
      this.cellsCanvas = document.getElementById("cells-canvas") as HTMLCanvasElement;
      this.cellsCanvas.addEventListener("mousedown", (event) => this.canvasMouseDownEvent(event));
      this.cellsCanvasContext = this.cellsCanvas.getContext("2d");
      this.linesCanvas = document.getElementById("lines-canvas") as HTMLCanvasElement;
      this.linesCanvasContext = this.linesCanvas.getContext("2d");
      this.updateAllCanvases(true);
    },
    runPathFinding() {
      this.pathFinding = new PathFinding(this.cellGrid, this.startCellPoint, this.endCellPoint);
      const path = this.pathFinding.depthFirstSearch();
      this.drawPath(path);
    },
    generateCellGrid(randomNoise: number | null = null, loadTestData: boolean) {
      if(loadTestData) {
        this.cellGrid = testData;
        return;
      }

      const cellGrid: Cell[][] = Array.from(Array(this.gridStep), () => Array(this.gridStep));

      for(let i=0; i<this.gridStep; i++) {
        for(let j=0; j<this.gridStep; j++) {

          const xCoord: number = this.vueCanvasWidth / this.gridStep * j;
          const yCoord: number = this.vueCanvasHeight / this.gridStep * i;
          const isStart: boolean = i === 0 && j === 0;
          const isEnd: boolean = i === this.gridStep - 1 && j === this.gridStep - 1;

          this.startCell = isStart ? cellGrid[i][j] : this.startCell;
          this.startCellPoint = isStart ? [j,i] : this.startCellPoint;
          this.endCell = isEnd ? cellGrid[i][j] : this.endCell;
          this.endCellPoint = isEnd ? [j,i] : this.endCellPoint;

          let isWall = false;

          if(!isStart && !isEnd) {
            isWall = randomNoise ? Math.random() <= randomNoise : false;
          }

          cellGrid[i][j] = {
            x: xCoord,
            y: yCoord,
            start: isStart,
            end: isEnd,
            wall: isWall,
          }
        }
      }

      this.cellGrid = cellGrid;
    },
    drawGridLines() {
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;

      this.linesCanvasContext.beginPath();

      for(let i=0; i<this.vueCanvasWidth; i+=cellWidth) {
        this.linesCanvasContext.moveTo(i, 0);
        this.linesCanvasContext.lineTo(i, this.vueCanvasHeight);
      }

      for(let i=0; i<this.vueCanvasHeight; i+=cellHeight) {
        this.linesCanvasContext.moveTo(0, i);
        this.linesCanvasContext.lineTo(this.vueCanvasWidth, i);
      }

      this.linesCanvasContext.stroke();

    },
    drawCells() {
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;
      
      for(let i=0; i<this.gridStep; i++) {
        for(let j=0; j<this.gridStep; j++) {
          const currentCell = this.cellGrid[i][j];
          const imageObj = new Image();

          imageObj.addEventListener('load', () => {
            this.cellsCanvasContext.drawImage(imageObj, currentCell.x, currentCell.y, cellWidth, cellHeight);
          });

          if(currentCell.start) {
            this.cellsCanvasContext.fillStyle = "green";
            this.cellsCanvasContext?.fillRect(currentCell.x, currentCell.y, cellWidth, cellHeight);
          } else if(currentCell.end) {
            imageObj.src = "src/components/icons/icons8-star-48.PNG";
          } else {
            this.cellsCanvasContext.fillStyle = currentCell.wall ? "gray" : "white";
            this.cellsCanvasContext?.fillRect(currentCell.x, currentCell.y, cellWidth, cellHeight);
          }
        }
      }
    },
    updateCellsCanvas(newGrid: boolean) {
      this.clearCanvasBackground();
      this.drawCanvasBackground();
      if(newGrid) {
        this.generateCellGrid(0.2, false);
      }
      this.drawCells();
    },
    updateLinesCanvas() {
      this.clearLinesCanvas();
      this.drawGridLines();
    },
    updateAllCanvases(newGrid: boolean) {
      this.updateCellsCanvas(newGrid);
      this.updateLinesCanvas();
    },
    drawCanvasBackground() {
      this.cellsCanvasContext.fillStyle = "white";
      this.cellsCanvasContext.fillRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
    },
    clearCanvasBackground() {
      this.cellsCanvasContext.clearRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
    },
    clearLinesCanvas() {
      this.linesCanvasContext.clearRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
    },
    canvasMouseDownEvent(event: MouseEvent) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const cell = this.getCellFromCoordinates(x, y);
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;

      if(this.paintMode) {
        this.cellsCanvasContext.fillStyle = cell.wall ? "white" : "gray";
        cell.wall = !cell.wall;
        this.cellsCanvasContext?.fillRect(cell.x, cell.y, cellWidth, cellHeight);
        this.pathFinding = new PathFinding(this.cellGrid, this.startCellPoint, this.endCellPoint);
      }
    },
    getCellFromCoordinates(x: number, y: number): Cell | null {
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;

      const j = Math.floor(x / cellWidth);
      const i = Math.floor(y / cellHeight);

      if(i < 0 || i >= this.gridStep || j < 0 || j >= this.gridStep) {
        return null;
      }

      return this.cellGrid[i][j];
    },
    async drawPath(pathArray: [number,number][]) {

      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;
      
      for(let i=0; i<pathArray.length - 1; i++) {
        const currentCell = this.cellGrid[pathArray[i][1]][pathArray[i][0]];
        this.cellsCanvasContext.fillStyle = "red";
        this.cellsCanvasContext?.fillRect(currentCell.x, currentCell.y, cellWidth, cellHeight);
        await timer(this.delay)
      }
    },
  }
})

const timer = ms => new Promise(res => setTimeout(res, ms));
</script>

<template>
  <div id="path-finding-grid">
    <div id="canvas-container">
      <canvas id="cells-canvas" :width="vueCanvasWidth" :height="vueCanvasHeight"></canvas>
      <canvas id="lines-canvas" :width="vueCanvasWidth" :height="vueCanvasHeight"></canvas>
    </div>
    <div id="settings-container">
      Grid Step
      <input type="number" v-model="gridStep" />
      Delay
      <input type="number" v-model="delay" />
      <button @click="updateAllCanvases(true)">Update Grid</button>
      <button @click="runPathFinding()">Run</button>
    </div>
    <div id="message-container">
      <div class="message-paragraph">For grids of a grid step of 100, there is sometimes a maximum call stack size exceeded error.</div>
      <div class="message-paragraph">Try a maximum grid step of 80 - 90 and a delay of 5.</div>
    </div>
  </div>
</template>

<style scoped>
#cells-canvas, #lines-canvas {
  margin: 20px;
}

#canvas-container {
  display: flex;
  position: relative;
}

#lines-canvas {
  position: absolute;
  pointer-events: none;
}

.message-paragraph {
  margin: 10px;
}
</style>
 