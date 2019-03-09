import FPS from './fps';
import { TriangleDrawer } from './triangle-drawer';

let td: TriangleDrawer;
let output: HTMLElement;

const offSpeed = 0.05;
const offStart = Date.now();
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
    const diff = Date.now() - offStart;
    const offx = diff * offSpeed;
    const { overzero, underzero } = td.drawTryangles(offx, 0);
    td.width = width;

    out.triangleCount.innerText = '' + (overzero + underzero);
    out.positiveNoise.innerText = '~ ' + Math.round((overzero / (overzero + underzero)) * 100) + '%';
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

const doSmth = () => {
    // output = document.getElementsByTagName('output')[0];
    const canvas = document.getElementsByTagName('canvas')[0];
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

if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', doSmth);
else
    window.location.reload();

