<script lang="ts">

import { defineComponent, reactive, toRefs } from 'vue'
import type { Cell } from '../types/Cell'

export default defineComponent({
  name: 'PathFindingGrid',
  components: {},
  setup() {

    const state = reactive({
      vueCanvas: null as HTMLCanvasElement | HTMLElement | null,
      vueContext: null as CanvasRenderingContext2D | null,
      vueCanvasWidth: 1240 as number,
      vueCanvasHeight: 680 as number,
      canvasPadding: 20,
      cellGrid: null as Cell[][] | null,
      gridStep: 10 as number,
    });

    return { ...toRefs(state) };
  },
  mounted() {
    this.initialiseCanvas();
    this.generateCellGrid();
    this.drawCells();
  },
  methods: {
    changeVueCanvas(canvas: HTMLCanvasElement | HTMLElement | null) {
      this.vueCanvas = canvas;
      return canvas;
    },
    changeVueConext(context: CanvasRenderingContext2D | null) {
      this.vueContext = context;
      return context;
    },
    initialiseCanvas() {
      const canvas = document.getElementById("grid-canvas") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");  
      this.changeVueCanvas(canvas);
      this.changeVueConext(ctx);
      this.drawCanvasBackground();
      this.updateCanvas();
      this.generateCellGrid();
      this.drawCells();
    },
    generateCellGrid() {
      const cellGrid: Cell[][] = Array.from(Array(this.gridStep), () => Array(this.gridStep));

      for(let i=0; i<this.gridStep; i++) {
        for(let j=0; j<this.gridStep; j++) {
          const xCoord = this.vueCanvasWidth / this.gridStep * i;
          const yCoord = this.vueCanvasHeight / this.gridStep * j;

          cellGrid[i][j] = {
            x: xCoord,
            y: yCoord,
            start: false,
            end: false,
            wall: false,
          }
        }
      }

      this.cellGrid = cellGrid;
    },
    drawGridLines() {
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;

      this.vueContext.beginPath();

      for(let i=0; i<this.vueCanvasWidth; i+=cellWidth) {
        this.vueContext.moveTo(i, 0);
        this.vueContext.lineTo(i, this.vueCanvasHeight);
      }

      for(let i=0; i<this.vueCanvasHeight; i+=cellHeight) {
        this.vueContext.moveTo(0, i);
        this.vueContext.lineTo(this.vueCanvasWidth, i);
      }

      this.vueContext.stroke();

    },
    drawCells() {
      const cellWidth = this.vueCanvasWidth / this.gridStep;
      const cellHeight = this.vueCanvasHeight / this.gridStep;
      
      for(let i=0; i<this.gridStep; i++) {
        for(let j=0; j<this.gridStep; j++) {
          const currentCell = this.cellGrid[i][j];
          this.vueContext.font = "1rem Arial";
          this.vueContext.fillStyle = "red"
          this.vueContext.fillText(`${currentCell.x}x,${currentCell.y}y`, (currentCell.x + cellWidth / 2) - 40, (currentCell.y + cellHeight / 2));
        }
      }
    },
    updateCanvas() {
      this.clearCanvasBackground();
      this.drawCanvasBackground();
      this.drawGridLines();
    },
    drawCanvasBackground() {
      this.vueContext.fillStyle = "white";
      this.vueContext.fillRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
    },
    clearCanvasBackground() {
      this.vueContext.clearRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
    }
  }
})
</script>

<template>
  <div id="canvas-container">
    <canvas id="grid-canvas" :width="vueCanvasWidth" :height="vueCanvasHeight"></canvas>
    <div id="settings-container">
      Grid Step
      <input v-model="gridStep" @input="updateCanvas" />
    </div>
  </div>
</template>

<style scoped>
#grid-canvas {
  padding: 20px;
}
</style>
 