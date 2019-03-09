import RingBuffer from './ring-buffer';

const raf = window.requestAnimationFrame.bind(window);

export default class FPS {
    private stack: RingBuffer<number>;
    constructor(stacksize = 10) {
        this.stack = new RingBuffer(stacksize);

        let last = 0;
        const loop = (ts: number) => {
            this.stack.append(ts - last);
            last = ts;

            raf(loop);
        }

        raf(ts => {
            last = ts;
            raf(loop);
        });
    }

    get fps() {
        let length = 0;
        let sum = 0;
        for (let ts of this.stack) {
            sum += ts;
            length++;
        }

        if (length == 0)
            return NaN;

        return 1000 / (sum / length);
    }

    toString(precision = 1) {
        precision = Math.round(precision);
        if (precision < 1)
            return Math.round(this.fps);
        else {
            const shift = Math.pow(10, precision);
            return Math.round(this.fps * shift) / shift;
        }
    }
}