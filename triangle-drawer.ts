import OpenSimplexNoise from 'open-simplex-noise';
import Color from 'color';
import Triangle from './triangle';

const osn = new OpenSimplexNoise();

// import Vector from './vector';

// const sqrtThreeHalf = Math.sqrt(3) / 2;
const rgbToHexString = (r: number, g: number, b: number) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

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
        const off = 0;
        c.moveTo(cx + m * halfWidth - off, cy + m * halfHeight - off);
        c.lineTo(cx - m * halfWidth + off, cy + m * halfHeight + off);
        c.lineTo(cx, cy - m * halfHeight + off);
        c.closePath();
    }

    drawTryangles(offx: number, offy: number) {
        const { halfWidth, halfHeight, height } = this.triangle;
        const trianglesCountHeight = Math.ceil(this.canvasHeight / height);
        const trianglesCountWidth = Math.ceil(1 + this.canvasWidth / halfWidth);

        const c = this.context;
        // const m = (<any>c).currentTransform;
        // console.log(m);
        // c.setTransform(0, 0, 0, 0, 0, 0);
        c.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        // c.getTransform

        // c.strokeStyle = '#77FF00';
        // const scale = 1 / 50;
        const scale = 1 / this.scale;

        let underzero = 0;
        let overzero = 0;

        // for (let n = 0; n < 10; n++) {
        // c.translate(15, 6);
        // c.strokeStyle = '#' + (16 + n * 20).toString(16) + 'FF00';

        for (let yi = 0; yi < trianglesCountHeight; yi++)
            for (let xi = 0; xi < trianglesCountWidth; xi++) {
                const centerX = halfWidth * xi;
                const centerY = halfHeight + height * yi;
                const upside = (yi % 2 + xi) % 2 == 0;
                this.setTryanglePath(centerX, centerY, upside);
                const noise = osn.noise2D((offx + centerX) * scale, (offy + centerY) * scale);
                if (noise < 0)
                    underzero++;
                else
                    overzero++;

                c.fillStyle = /*noise < 0 ?
                        Color.hsl(190, 50, 50).hex() :*/
                    // Color.hsl((noise < 0 ? 200 : 50) + 40 * noise, 50, 50).hex();
                    Color.hsl(200 + 40 * noise, 50, 50).hex();
                // Color.hsl(200 + 120 * (xi + yi) / (trianglesCountHeight + trianglesCountWidth), 50, 50).hex();

                // c.fillStyle = '#000000';

                // c.fillStyle = rgbToHexString(Math.random() * 255, Math.random() * 255, Math.random() * 255);
                c.fill();
                // c.stroke();
            }
        // }

        return { underzero, overzero };
    }
}