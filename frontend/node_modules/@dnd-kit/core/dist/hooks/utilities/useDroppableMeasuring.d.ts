import type { DroppableContainer, LayoutRectMap } from '../../store/types';
import type { LayoutRect } from '../../types';
interface Arguments {
    dragging: boolean;
    dependencies: any[];
    config: Partial<DroppableMeasuring> | undefined;
}
export declare enum MeasuringStrategy {
    Always = 0,
    BeforeDragging = 1,
    WhileDragging = 2
}
export declare enum MeasuringFrequency {
    Optimized = "optimized"
}
declare type MeasuringFunction = (element: HTMLElement) => LayoutRect;
export interface DroppableMeasuring {
    measure: MeasuringFunction;
    strategy: MeasuringStrategy;
    frequency: MeasuringFrequency | number;
}
export declare function useDroppableMeasuring(containers: DroppableContainer[], { dragging, dependencies, config }: Arguments): {
    layoutRectMap: LayoutRectMap;
    recomputeLayouts: () => void;
    willRecomputeLayouts: boolean;
};
export {};
