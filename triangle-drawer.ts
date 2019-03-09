import Triangle from './triangle';
import { ColorAtPosition, ColorDefiner } from './color-definer';
// import Vector from './vector';

// const sqrtThreeHalf = Math.sqrt(3) / 2;

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

    drawTriangles(cd: ColorDefiner) {
        const { halfWidth, halfHeight, height } = this.triangle;
        const trianglesCountHeight = Math.ceil(this.canvasHeight / height);
        const trianglesCountWidth = Math.ceil(1 + this.canvasWidth / halfWidth);

        const c = this.context;
        c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        cd.cycleStart();
        for (let yi = 0; yi < trianglesCountHeight; yi++)
            for (let xi = 0; xi < trianglesCountWidth; xi++) {
                const centerX = halfWidth * xi;
                const centerY = halfHeight + height * yi;

                const upside = (yi % 2 + xi) % 2 == 0;
                this.setTryanglePath(centerX, centerY, upside);

                const fillColor = cd.fillStyleDefiner(centerX, centerY);

                if (fillColor) {
                    c.fillStyle = fillColor;
                    c.fill();
                }

                const strokeColor = cd.strokeStyleDefiner(centerX, centerY);

                if (strokeColor) {
                    c.strokeStyle = strokeColor;
                    c.stroke();
                }
            }
        cd.cycleEnd();
    }
}