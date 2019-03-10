import FPS from './fps';
import { TriangleDrawer } from './triangle-drawer';
import { EventElementWrapper, createEventElementMapper } from './util';
import { TraversingColorDefiner } from './traversing-color-definer';
import { TableRenderer } from './table-renderer';
import { PointColorDefiner } from './point-color-definer';

if ((<any>module).hot)
    (<any>module).hot.dispose(() => location.reload());

const metaTable = new TableRenderer();
const drawerTable = new TableRenderer();

let currentActive = 0;
const colorDefiner: any = [
    {
        description: 'Traversing + Noise',
        cd: new TraversingColorDefiner(drawerTable, 0.05, 200)
    }, {
        description: 'Cursor',
        cd: new PointColorDefiner(drawerTable, 4)
    }
];

let td: TriangleDrawer;
let canvas: HTMLCanvasElement;

const raf = window.requestAnimationFrame.bind(window);
const fps = new FPS();

let width = 75;

const prepColorDefiner = () => {
    const { cd } = colorDefiner[currentActive];

    if (currentActive == 1) {
        const point = bounding || {
            onElementX: (+canvas.getAttribute('width')) / 2,
            onElementY: (+canvas.getAttribute('height')) / 2
        };

        cd.point.x = point.onElementX;
        cd.point.y = point.onElementY;
    }

    return cd;
}

const cycle = () => {

    const cd = prepColorDefiner();
    const triangleCount = td.drawTriangles(cd);
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

let bounding: any = null;
let canvasMapper: EventElementWrapper;

addEventListener('mousemove', ev => {
    bounding = canvasMapper(ev);
})

const displayOptions = (wrapper: HTMLElement) => {


    let options = '';

    for (let i in colorDefiner) {
        options += '<div data-opt-id="' + i + '"><div>' + ((+i) + 1) + '</div><div>' + colorDefiner[i].description + '</div></div>';
    }

    wrapper.innerHTML = options;

    const getOptionFromElem = (elem: any) => +elem.dataset.optId;

    const setOptionAsActive = (option: HTMLDivElement | number) => {
        currentActive = NaN;
        for (let elem of wrapper.children) {
            const optoinsId = getOptionFromElem(elem);
            if (elem == option || optoinsId == option) {
                elem.className = 'active';
                currentActive = optoinsId;
            } else {
                elem.className = '';
            }
        }
    }

    wrapper.addEventListener('click', ev => {
        const original = <HTMLDivElement>(<any>ev).originalTarget;
        const parent = <HTMLDivElement>original.parentElement;

        if (original.dataset.optId)
            setOptionAsActive(original);
        else if (parent.dataset.optId)
            setOptionAsActive(parent);
    });
    setOptionAsActive(currentActive);
}

const intialize = () => {
    canvas = document.getElementsByTagName('canvas')[0];
    const optionswrapper = document.getElementsByTagName('div')[1];
    canvasMapper = createEventElementMapper(canvas)
    const context = canvas.getContext('2d');

    const output = document.getElementsByTagName('output')[0];
    output.innerHTML = '';
    output.appendChild(metaTable.table);
    output.appendChild(drawerTable.table);

    displayOptions(optionswrapper);

    if (!context)
        throw new Error('could not create the 2d context');

    td = new TriangleDrawer(context, width, 200);

    // const v = new Vector(0, 1);
    // console.log(v.toString(), v.rotate(1 / 3).toString(), v.rotate(2 / 3).toString());
    raf(cycle);
}

document.addEventListener('DOMContentLoaded', intialize);