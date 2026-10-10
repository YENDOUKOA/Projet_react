import type { CanvasItem } from "./canvas/CanvasItem";

export class PersistentElements {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public items: CanvasItem[] = [];
    public selectedItem: CanvasItem | null = null;

    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;

    constructor(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        fillStyle: string = "#0d00ff",
        strokeStyle: string = "#000000",
        lineWidth: number = 2
    ) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    setFillStyle(color: string): void {
        this.fillStyle = color;

        if (this.selectedItem) {
            this.selectedItem.fillStyle = color;
        }

        this.redraw();
    }

    setStrokeStyle(color: string): void {
        this.strokeStyle = color;

        if (this.selectedItem) {
            this.selectedItem.strokeStyle = color;
        }

        this.redraw();
    }

    setLineWidth(width: number): void {
        if (!Number.isFinite(width) || width < 0 || width > 10) return;

        this.lineWidth = width;

        if (this.selectedItem) {
            this.selectedItem.lineWidth = width;
        }

        this.redraw();
    }

    addItem(item: CanvasItem): void {
        this.items.push(item);
        this.selectedItem = item;
    }

    removeSelectedItem(): void {
        if (!this.selectedItem) return;

        this.items = this.items.filter(
            item => item !== this.selectedItem
        );

        this.selectedItem = null;
        this.redraw();
    }

    duplicateSelectedItem(): void {
        if (!this.selectedItem) return;

        const copy = this.selectedItem.duplicate();
        copy.move(20, 20);
        this.addItem(copy);
        this.redraw();
    }

    getItemAt(x: number, y: number): CanvasItem | null {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].contains(x, y)) {
                return this.items[i];
            }
        }

        return null;
    }

    getMousePos(x: number, y: number) {
        const rect = this.canvas.getBoundingClientRect();

        return {
            x: x - rect.left,
            y: y - rect.top
        };
    }
    changeDepth(direction: number): void {
    const item = this.selectedItem;

    if (!item || direction === 0) return;

    const index = this.items.indexOf(item);
    if (index === -1) return;

    const nextIndex = index + (direction > 0 ? 1 : -1);

    // Ne pas sortir des limites du tableau.
    if (nextIndex < 0 || nextIndex >= this.items.length) return;

    // Échanger l'objet sélectionné avec son voisin.
    [this.items[index], this.items[nextIndex]] = [
        this.items[nextIndex],
        this.items[index]
    ];

    this.redraw();
}

    redraw(): void {
        this.ctx.clearRect(
            0, 0, this.canvas.width, this.canvas.height
        );

        this.items.forEach(item => item.draw());
    }
}