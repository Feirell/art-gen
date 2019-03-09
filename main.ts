import FPS from './fps';
import { TriangleDrawer } from './triangle-drawer';
import { EventElementWrapper, createEventElementMapper } from './util';
import { TraversingColorDefiner } from './traversing-color-definer';
import { TableRenderer } from './table-renderer';

if ((<any>module).hot)
    (<any>module).hot.dispose(() => location.reload());

const metaTable = new TableRenderer();
const drawerTable = new TableRenderer();
const tcd = new TraversingColorDefiner(drawerTable, 0.05, 200);

let td: TriangleDrawer;
let canvas: HTMLCanvasElement;

const raf = window.requestAnimationFrame.bind(window);
const fps = new FPS();

let width = 75;

const cycle = () => {
    // output.innerText = "";
    const triangleCount = td.drawTriangles(tcd);
    td.width = width;

    metaTable.data = [
        ['Triangle Count:', '' + triangleCount],
        ['Fames per Second:', '' + fps.toString(0) + ' hz'],
        ['Triangle Width:', '' + width + ' px']
    ];

    metaTable.render();
    drawerTable.render();

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
    // output = ;
    canvas = document.getElementsByTagName('canvas')[0];
    const context = canvas.getContext('2d');

    const output = document.getElementsByTagName('output')[0];
    output.innerHTML = '';
    output.appendChild(metaTable.table);
    output.appendChild(drawerTable.table);

    // out = {
    //     triangleCount: <HTMLElement>document.getElementById("out-triangle-count"),
    //     positiveNoise: <HTMLElement>document.getElementById("out-positive-noise"),
    //     framesPerSecond: <HTMLElement>document.getElementById("out-frames-per-second"),
    //     triangleWidth: <HTMLElement>document.getElementById("out-triangle-width")
    // }



    if (!context)
        throw new Error('could not create the 2d context');

    td = new TriangleDrawer(context, width, 200);

    // const v = new Vector(0, 1);
    // console.log(v.toString(), v.rotate(1 / 3).toString(), v.rotate(2 / 3).toString());
    raf(cycle);
}

document.addEventListener('DOMContentLoaded', intialize);