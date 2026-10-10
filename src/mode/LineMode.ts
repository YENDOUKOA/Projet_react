import type { MouseEvent } from "react";
import type { Mode } from "./Mode";
import type { PersistentElements } from "../PersistentElement";
import { LineItem } from "../canvas/LineItem";

export class LineMode implements Mode {
    private currentLine: LineItem | null = null;

    constructor(private elements: PersistentElements) {}

    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const line = new LineItem(
            this.elements.ctx,
            point,
            this.elements.fillStyle,
            this.elements.strokeStyle,
            this.elements.lineWidth
        );

        this.currentLine = line;
        this.elements.addItem(line);
        this.elements.redraw();
    }

    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!this.currentLine) return;

        if ((event.buttons & 1) === 0) {
            this.currentLine = null;
            return;
        }

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        this.currentLine.update(point.x, point.y);
        this.elements.redraw();
    }

    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        if (this.currentLine) {
            const point = this.elements.getMousePos(
                event.clientX,
                event.clientY
            );

            this.currentLine.update(point.x, point.y);
            this.elements.redraw();
        }

        this.currentLine = null;
    }
}