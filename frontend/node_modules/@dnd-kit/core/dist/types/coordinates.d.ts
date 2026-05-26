import type { Coordinates } from '@dnd-kit/utilities';
export type { Coordinates };
export declare type DistanceMeasurement = number | Coordinates | Pick<Coordinates, 'x'> | Pick<Coordinates, 'y'>;
export declare type Translate = Coordinates;
export interface LayoutRect {
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
}
export interface ViewRect extends LayoutRect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}
export interface ClientRect extends ViewRect {
}
export interface ScrollCoordinates {
    initial: Coordinates;
    current: Coordinates;
    delta: Coordinates;
}
