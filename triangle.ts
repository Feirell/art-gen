const sqrtThreeHalf = Math.sqrt(3) / 2;

export default class Triangle {
    width!: number;
    height!: number;
    halfWidth!: number;
    halfHeight!: number;

    constructor(w: number) { this.setWidth(w); }

    setWidth(w: number) {
        const h = w * sqrtThreeHalf;

        this.height = h;
        this.width = w;

        this.halfWidth = w / 2;
        this.halfHeight = h / 2;
    }
}