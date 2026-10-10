import type { MouseEvent } from "react";
import type { Mode } from "./Mode";
import type { PersistentElements } from "../PersistentElement";

export class SelectMoveMode implements Mode {
    private lastPoint: { x: number; y: number } | null = null;

    constructor(
        private elements: PersistentElements,
        private onSelectionChange: () => void
    ) {}

    onMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const item = this.elements.getItemAt(point.x, point.y);
        this.elements.selectedItem = item;

        if (item) {
            // Afficher les réglages de l'objet sélectionné.
            this.elements.fillStyle = item.fillStyle;
            this.elements.strokeStyle = item.strokeStyle;
            this.elements.lineWidth = item.lineWidth;

            this.lastPoint = point;
        } else {
            this.lastPoint = null;
        }

        this.onSelectionChange();
        this.elements.redraw();
    }

    onMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!this.lastPoint || !this.elements.selectedItem) return;

        if ((event.buttons & 1) === 0) {
            this.lastPoint = null;
            return;
        }

        const point = this.elements.getMousePos(
            event.clientX,
            event.clientY
        );

        const dx = point.x - this.lastPoint.x;
        const dy = point.y - this.lastPoint.y;

        this.elements.selectedItem.move(dx, dy);
        this.lastPoint = point;

        this.elements.redraw();
    }

    onMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        if (event.button !== 0) return;

        // Prendre en compte la dernière position de la souris.
        if (this.lastPoint && this.elements.selectedItem) {
            const point = this.elements.getMousePos(
                event.clientX,
                event.clientY
            );

            this.elements.selectedItem.move(
                point.x - this.lastPoint.x,
                point.y - this.lastPoint.y
            );

            this.elements.redraw();
        }

        this.lastPoint = null;
    }
}