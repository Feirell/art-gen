import Color from 'color';


import { ColorDefiner } from "./color-definer";
import { TableRenderer } from './table-renderer';

export class PointColorDefiner implements ColorDefiner {
    public point = { x: NaN, y: NaN };

    constructor(private outputTable: TableRenderer, public scale: number) { }

    cycleStart(): void { }

    cycleEnd(): void { }

    fillStyleDefiner(x: number, y: number) {
        const distance = Math.sqrt(
            Math.pow(this.point.x - x, 2) +
            Math.pow(this.point.y - y, 2)
        )

        return Color.hsl(200 + 40 * this.scale * distance / 1000, 50, 50).hex();
    }

    strokeStyleDefiner(x: number, y: number) {
        return null;
    }
}