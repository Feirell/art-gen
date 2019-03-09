import OpenSimplexNoise from 'open-simplex-noise';
import Color from 'color';


import { ColorDefiner } from "./color-definer";
import { TableRenderer } from './table-renderer';

export class TraversingColorDefiner implements ColorDefiner {

    private offStart = Date.now();
    private osn = new OpenSimplexNoise();

    private overZero = 0;
    private underZero = 0;

    private offX = NaN;
    private offY = NaN;

    constructor(private outputTable: TableRenderer, private offSpeed: number, public scale: number) { }

    cycleStart(): void {
        this.overZero = this.underZero = 0;

        const diff = Date.now() - this.offStart;
        this.offX = diff * this.offSpeed;
        this.offY = 0;
    }

    cycleEnd(): void {
        this.outputTable.data = [
            ['Over Zero:', '~ ' + Math.round((this.overZero / (this.overZero + this.underZero)) * 100) + '%']
        ]
    }

    fillStyleDefiner(x: number, y: number) {
        const scale = 1 / this.scale;
        const noise = this.osn.noise2D(
            (this.offX + x) * scale,
            (this.offY + y) * scale
        );

        if (noise < 0)
            this.underZero++;
        else
            this.overZero++;

        return Color.hsl(200 + 40 * noise, 50, 50).hex();
    }

    strokeStyleDefiner(x: number, y: number) {
        return null;
    }
}