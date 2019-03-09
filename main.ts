import FPS from './fps';
import { TriangleDrawer } from './triangle-drawer';
import { EventElementWrapper, createEventElementMapper } from './util';
import { TraversingColorDefiner } from './traversing-color-definer';

if (module.hot)
    module.hot.dispose(() => location.reload());

const tcd = new TraversingColorDefiner(0.05, 200);

let td: TriangleDrawer;
let output: HTMLElement;
let canvas: HTMLCanvasElement;

let mouseX, mouseY;

const raf = window.requestAnimationFrame.bind(window);
const fps = new FPS();

let width = 75;

let out: {
    triangleCount: HTMLElement,
    positiveNoise: HTMLElement,
    framesPerSecond: HTMLElement,
    triangleWidth: HTMLElement
};

const cycle = () => {
    // output.innerText = "";
    tcd.cycleStart();
    const f = tcd.fillStyleDefiner.bind(tcd);
    const s = tcd.strokeStyleDefiner.bind(tcd);

    td.drawTryangles(f, s);
    tcd.cycleEnd();
    const { overZero, underZero } = tcd;
    td.width = width;

    out.triangleCount.innerText = '' + (overZero + underZero);
    out.positiveNoise.innerText = '~ ' + Math.round((overZero / (overZero + underZero)) * 100) + '%';
    out.framesPerSecond.innerText = '' + fps.toString(0) + ' hz';
    out.triangleWidth.innerText = '' + width + ' px';

    raf(cycle);
}

addEventListener('wheel', ev => {
    if (ev.deltaY != 0) {
        width += ev.deltaY > 0 ? 5 : -5;
        if (width <= 0)
            width = 1;
    }
})

addEventListener('keydown', ev => {
    if (ev.key == '+')
        width++;
    else if (ev.key == '-') {
        width--;
        if (width < 1) width = 1;
    }
})

let bounding;
let canvasMapper: undefined | EventElementWrapper = undefined;

addEventListener('mousemove', ev => {
    if (canvasMapper === undefined)
        canvasMapper = createEventElementMapper(canvas);

    bounding = canvasMapper(ev);

    // console.log(bounding);
})

const intialize = () => {
    // output = document.getElementsByTagName('output')[0];
    canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    out = {
        triangleCount: <HTMLElement>document.getElementById("out-triangle-count"),
        positiveNoise: <HTMLElement>document.getElementById("out-positive-noise"),
        framesPerSecond: <HTMLElement>document.getElementById("out-frames-per-second"),
        triangleWidth: <HTMLElement>document.getElementById("out-triangle-width")
    }



    if (!context)
        throw new Error('could not create the 2d context');

    td = new TriangleDrawer(context, width, 200);

    // const v = new Vector(0, 1);
    // console.log(v.toString(), v.rotate(1 / 3).toString(), v.rotate(2 / 3).toString());
    raf(cycle);
}

document.addEventListener('DOMContentLoaded', intialize);