export type EventElementWrapper = (ev: MouseEvent) => null | { onElementX: number, onElementY: number }

export const createEventElementMapper = (elem: HTMLElement): EventElementWrapper => {
    return (ev: MouseEvent) => {
        const eot = <HTMLElement>(<any>ev).explicitOriginalTarget;
        if (eot == elem) {
            const cr = <DOMRect>elem.getBoundingClientRect();
            return {
                onElementX: ev.clientX - cr.x,
                onElementY: ev.clientY - cr.y
            };
        } else return null;
    }
}

export const getAllKeys = (obj: any) => {
    const keys = [];
    for (let k in obj)
        keys.push(k);

    return keys;
}

export const getAllPropertiesOfObject = (obj: { [key: string]: any }, names: string[]) => {
    const o: { [key: string]: number } = {};
    for (let name of names)
        o[name] = obj[name];

    return o;
}

export const rgbToHexString = (r: number, g: number, b: number) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');