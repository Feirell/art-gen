import OpenSimplexNoise from 'open-simplex-noise';
import Color from 'color';
import Triangle from './triangle';

const osn = new OpenSimplexNoise();

// import Vector from './vector';

// const sqrtThreeHalf = Math.sqrt(3) / 2;
const rgbToHexString = (r: number, g: number, b: number) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

export type ColorAtPosition = (x: number, y: number) => string | null;
export class TriangleDrawer {
    context: CanvasRenderingContext2D;
    triangle!: Triangle;
    scale: number;

    constructor(context: CanvasRenderingContext2D, width: number, scale: number, ) {
        this.context = context;
        this.width = width;
        this.scale = scale;
    }

    set width(w: number) {
        this.triangle = new Triangle(w);
    }

    get width() {
        return this.triangle.width;
    }

    get canvasWidth() { return this.context.canvas.width; }
    get canvasHeight() { return this.context.canvas.height; }

    setTryanglePath(cx: number, cy: number, up = true) {
        const { halfWidth, halfHeight } = this.triangle;
        const m = up ? 1 : -1;
        const c = this.context;
        c.beginPath();

        c.moveTo(cx + m * halfWidth, cy + m * halfHeight);
        c.lineTo(cx - m * halfWidth, cy + m * halfHeight);
        c.lineTo(cx, cy - m * halfHeight);
        c.closePath();
    }

    drawTryangles(fillColorFnc: ColorAtPosition, strokeColorFnc: ColorAtPosition) {
        const { halfWidth, halfHeight, height } = this.triangle;
        const trianglesCountHeight = Math.ceil(this.canvasHeight / height);
        const trianglesCountWidth = Math.ceil(1 + this.canvasWidth / halfWidth);

        const c = this.context;
        c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        for (let yi = 0; yi < trianglesCountHeight; yi++)
            for (let xi = 0; xi < trianglesCountWidth; xi++) {
                const centerX = halfWidth * xi;
                const centerY = halfHeight + height * yi;
                const upside = (yi % 2 + xi) % 2 == 0;
                this.setTryanglePath(centerX, centerY, upside);

                const fillColor = fillColorFnc(centerX, centerY);

                if (fillColor) {
                    c.fillStyle = fillColor;
                    c.fill();
                }

                const strokeColor = strokeColorFnc(centerX, centerY);

                if (strokeColor) {
                    c.strokeStyle = strokeColor;
                    c.stroke();
                }
            }
    }
}