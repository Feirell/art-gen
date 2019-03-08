export default class RingBuffer<T>{
    private readonly backing: Array<T>;
    private readonly size: number;

    private start = 0;
    private length = 0;
    constructor(size: number) {
        this.backing = new Array(this.size = size);
    }

    append(val: T) {
        this.backing[(this.start + this.length) % this.size] = val;

        if (this.size == this.length)
            this.start = (this.start + 1) % this.size;
        else
            this.length++;
    }

    *indexIterator() {
        for (let increment = 0; increment < this.length; increment++)
            yield (this.start + increment) % this.backing.length;
    }

    *[Symbol.iterator]() {
        const ii = this.indexIterator();
        for (let ind of ii)
            yield this.backing[ind];
    }

    getAsArray() {
        return Array.from(this);
    }
}