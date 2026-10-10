import type { MouseEvent } from "react";

export interface Mode {
    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void;
    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void;
    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void;
}