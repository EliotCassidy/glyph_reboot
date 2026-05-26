import type { DndContextDescriptor } from '../../store';
interface Arguments {
    disabled: boolean;
    forceRecompute: boolean;
}
export declare function useDragOverlayMeasuring({ disabled, forceRecompute, }: Arguments): DndContextDescriptor['dragOverlay'];
export {};
