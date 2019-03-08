export default class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    rotate(d: number) {
        const a = 2 * Math.PI * d;
        const ca = Math.cos(a);
        const sa = Math.sin(a);

        return new Vector(this.x * ca - this.y * sa, this.x * sa + this.y * ca);
    }

    toString() {
        return `Vector{x: ${this.x}, y: ${this.y}}`;
    }
}