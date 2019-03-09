const copyAndThrow2d = (data: any[][], type: string, typeOf: (x: any) => string = x => typeof x): any[][] => {
    let depth;
    const base = [];
    for (let a = 0; a < data.length; a++) {
        const aArr = data[a];
        base[a] = [];

        if (depth === undefined)
            depth = aArr.length;
        else if (depth != aArr.length)
            throw new RangeError('the lengths of the subarrays are different');

        for (let b = 0; b < aArr.length; b++) {
            const val = aArr[b];
            if (typeOf(val) != type)
                throw new TypeError('data[' + a + '][' + b + '] was of type ' + typeOf(val) + ' but should have been of type ' + type);

            (<any[]>base[a])[b] = val;
        }
    }

    return base;
}

const getArrayDifferences2d = (a: any[][], b: any[][], compare = Object.is) => {
    if (a.length != b.length)
        return true;

    if (a.length == 0)
        return false;

    if (a[0].length != b[0].length)
        return true;

    if (a[0].length == 0)
        return false;

    const differences: [number, number][] = [];
    for (let x = 0; x < a.length; x++)
        for (let y = 0; y < a[x].length; y++)
            if (!compare(a[x][y], b[x][y]))
                differences.push([x, y]);

    return differences.length == 0 ? false : differences;
}

export class TableRenderer {
    private currentData: string[][] = [];

    public data: string[][] | null = null;
    private calculatedDifference: null | boolean | [number, number][] = null;

    public readonly table = document.createElement('table');

    constructor() {
        this.table.appendChild(document.createElement('thead'));
        this.table.appendChild(document.createElement('tbody'));
    }

    get needsToRender() {
        if (this.data == null)
            return false;

        if (this.calculatedDifference == null) {
            this.data = copyAndThrow2d(this.data, 'string');
            this.calculatedDifference = getArrayDifferences2d(this.currentData, this.data);
        }

        return typeof this.calculatedDifference == 'boolean' ? this.calculatedDifference : true;
    }

    render() {
        if (!this.needsToRender)
            return;

        const tbody = this.table.children[1];
        const data = <string[][]>this.data;
        const diff = <true | [number, number][]>this.calculatedDifference;

        this.data = this.calculatedDifference = null;

        if (diff) {
            tbody.innerHTML = '';
            for (let x = 0; x < data.length; x++) {
                const tr = document.createElement('tr');
                for (let y = 0; y < data[x].length; y++) {
                    const td = document.createElement('td');
                    td.innerText = data[x][y];
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
        } else {
            for (let [x, y] of (<[number, number][]>diff)) {
                const td = <HTMLTableDataCellElement>tbody.children[x].children[y];
                td.innerText = data[x][y];
            }
        }
    }
}