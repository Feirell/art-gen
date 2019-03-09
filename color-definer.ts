export type ColorAtPosition = (x: number, y: number) => string | null;
export interface ColorDefiner {
    // getDefiningFunctions(): { fill: ColorAtPosition, stroke: ColorAtPosition }

    cycleStart(): void;
    cycleEnd(): void;

    fillStyleDefiner: ColorAtPosition;
    strokeStyleDefiner: ColorAtPosition;
}