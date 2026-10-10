import type { MouseEvent } from "react";
import type { Mode } from "./Mode";
import type { PersistentElements } from "../PersistentElement";
import { PathItem } from "../canvas/PathItem";

export class PencilMode implements Mode {
    private currentPath: PathItem | null = null;

    constructor(private elements: PersistentElements) {}

    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const path = new PathItem(
            this.elements.ctx,
            point,
            this.elements.fillStyle,
            this.elements.strokeStyle,
            this.elements.lineWidth
        );

        this.currentPath = path;
        this.elements.addItem(path);
        this.elements.redraw();
    }

    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!this.currentPath) return;

        if ((event.buttons & 1) === 0) {
            this.currentPath = null;
            return;
        }

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        this.currentPath.update(point.x, point.y);
        this.elements.redraw();
    }

    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        if (this.currentPath) {
            const point = this.elements.getMousePos(
                event.clientX,
                event.clientY
            );

            this.currentPath.update(point.x, point.y);
            this.elements.redraw();
        }

        this.currentPath = null;
    }
}