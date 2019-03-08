import FPS from './fps';
import { TriangleDrawer } from './triangle-drawer';

let td: TriangleDrawer;
let output: HTMLElement;

const offSpeed = 0.05;
const offStart = Date.now();
const raf = window.requestAnimationFrame.bind(window);
const fps = new FPS();

let width = 75;

const cycle = () => {
    output.innerText = "";
    const diff = Date.now() - offStart;
    const offx = diff * offSpeed;
    td.drawTryangles(offx, 0);
    td.width = width;
    output.innerText += "\n" + fps.fps + "\nwidth: " + width;
    raf(cycle);
}

addEventListener('wheel', ev => {
    if (ev.deltaY != 0) {
        width += ev.deltaY > 0 ? 5 : -5;
        if (width <= 0)
            width = 1;
    }
    console.log('ev');
})

const doSmth = () => {
    output = document.getElementsByTagName('output')[0];
    const canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    if (!context)
        throw new Error('could not create the 2d context');

    td = new TriangleDrawer(context, width, 200, output);

    // const v = new Vector(0, 1);
    // console.log(v.toString(), v.rotate(1 / 3).toString(), v.rotate(2 / 3).toString());
    raf(cycle);
}

if (document.readyState == 'loading')
    document.addEventListener('DOMContentLoaded', doSmth);
else
    window.location.reload();

