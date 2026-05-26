/// <reference types="react" />
import { LayoutRect } from '@dnd-kit/core';
import { Transform } from '@dnd-kit/utilities';
interface Arguments {
    rect: React.MutableRefObject<LayoutRect | null>;
    disabled: boolean;
    index: number;
    node: React.MutableRefObject<HTMLElement | null>;
}
export declare function useDerivedTransform({ disabled, index, node, rect }: Arguments): Transform | null;
export {};
