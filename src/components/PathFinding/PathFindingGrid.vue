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
      vueCanvasWidth: 500 as number,
      vueCanvasHeight: 500 as number,
      cellGrid: null as Cell[][] | null,
      gridStep: 10 as number,
    });

    return { ...toRefs(state) };
  },
  mounted() {
    this.initialiseCanvas();
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
      this.updateCanvas();
    },
    generateCellGrid() {
      console.log('test');
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
      console.log('test');
    },
    updateCanvas() {
      this.vueContext.clearRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
      this.vueContext.fillStyle = "white";
      this.vueContext.fillRect(0, 0, this.vueCanvasWidth, this.vueCanvasHeight);
      this.drawGridLines();
      this.drawCells();
    },
  }
})
</script>

<template>
  <div id="canvas-container">
    <canvas id="grid-canvas" :width="vueCanvasWidth" :height="vueCanvasHeight"></canvas>
    <div id="settings-container">
      Canvas Height
      <input v-model="vueCanvasHeight" @input="updateCanvas" />
      Canvas Width
      <input v-model="vueCanvasWidth" @input="updateCanvas" />
      Grid Step
      <input v-model="gridStep" @input="updateCanvas" />
    </div>
  </div>
</template>
 