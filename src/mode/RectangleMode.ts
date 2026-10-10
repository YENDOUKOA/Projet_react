import type { MouseEvent } from "react";
import type { Mode } from "./Mode";
import type { PersistentElements } from "../PersistentElement";
import { RectangleItem } from "../canvas/RectangleItem";

export class RectangleMode implements Mode {
    private currentRectangle: RectangleItem | null = null;

    constructor(private elements: PersistentElements) {}

    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const rectangle = new RectangleItem(
            this.elements.ctx,
            point,
            this.elements.fillStyle,
            this.elements.strokeStyle,
            this.elements.lineWidth
        );

        this.currentRectangle = rectangle;
        this.elements.addItem(rectangle);
        this.elements.redraw();
    }

    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!this.currentRectangle) return;

        if ((event.buttons & 1) === 0) {
            this.currentRectangle = null;
            return;
        }

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        this.currentRectangle.update(point.x, point.y);
        this.elements.redraw();
    }

    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        if (this.currentRectangle) {
            const point = this.elements.getMousePos(
                event.clientX,
                event.clientY
            );

            this.currentRectangle.update(point.x, point.y);
            this.elements.redraw();
        }

        this.currentRectangle = null;
    }
}