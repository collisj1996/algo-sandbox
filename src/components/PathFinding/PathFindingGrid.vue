<script lang="ts">

import { defineComponent, reactive, toRefs } from 'vue'
import type { Cell } from '../types/Cell'

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
      paintMode: false as boolean,
      startCell: null as Cell | null,
      endCell: null as Cell | null,
    });

    return { ...toRefs(state) };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.cellsCanvas = document.getElementById("cells-canvas") as HTMLCanvasElement;
      this.cellsCanvasContext = this.cellsCanvas.getContext("2d");
      this.linesCanvas = document.getElementById("lines-canvas") as HTMLCanvasElement;
      this.linesCanvasContext = this.linesCanvas.getContext("2d");
      this.updateAllCanvases(true);
    },
    generateCellGrid(randomNoise: number | null = null) {
      const cellGrid: Cell[][] = Array.from(Array(this.gridStep), () => Array(this.gridStep));

      for(let i=0; i<this.gridStep; i++) {
        for(let j=0; j<this.gridStep; j++) {

          const xCoord: number = this.vueCanvasWidth / this.gridStep * i;
          const yCoord: number = this.vueCanvasHeight / this.gridStep * j;
          const isStart: boolean = i === 0 && j === 0;
          const isEnd: boolean = i === this.gridStep - 1 && j === this.gridStep - 1;

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

          imageObj.onload = () => {
            this.cellsCanvasContext.drawImage(imageObj, currentCell.x, currentCell.y, cellWidth, cellHeight);
          };

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
        this.generateCellGrid(0.2);
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
  }
})
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
      <button @click="updateAllCanvases(true)">Update Grid</button>
    </div>
  </div>
</template>

<style scoped>
#cells-canvas, #lines-canvas {
  padding: 20px;
}

#canvas-container {
  display: flex;
  position: relative;
}

#lines-canvas {
  position: absolute;
}
</style>
 