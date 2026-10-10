import type { MouseEvent } from "react";
import type { Mode } from "./Mode";
import type { PersistentElements } from "../PersistentElement";
import { EllipseItem } from "../canvas/EllipseItem";

export class EllipseMode implements Mode {
    private currentEllipse: EllipseItem | null = null;

    constructor(private elements: PersistentElements) {}

    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const ellipse = new EllipseItem(
            this.elements.ctx,
            point,
            this.elements.fillStyle,
            this.elements.strokeStyle,
            this.elements.lineWidth
        );

        this.currentEllipse = ellipse;
        this.elements.addItem(ellipse);
        this.elements.redraw();
    }

    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!this.currentEllipse) return;

        if ((event.buttons & 1) === 0) {
            this.currentEllipse = null;
            return;
        }

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        this.currentEllipse.update(point.x, point.y);
        this.elements.redraw();
    }

    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        if (this.currentEllipse) {
            const point = this.elements.getMousePos(
                event.clientX,
                event.clientY
            );

            this.currentEllipse.update(point.x, point.y);
            this.elements.redraw();
        }

        this.currentEllipse = null;
    }
}