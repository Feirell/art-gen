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

    getFps(precision = 1) {
        let length = 0;
        let sum = 0;
        for (let ts of this.stack) {
            sum += ts;
            length++;
        }

        if (length == 0)
            return NaN;

        const fps = 1000 / (sum / length);

        return Math.round(fps * 10) / 10;
    }

    get fps() {
        return this.getFps();
    }
}