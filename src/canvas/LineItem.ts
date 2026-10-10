import type { CanvasItem } from "./CanvasItem";

export class LineItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    firstPoint: { x: number; y: number };
    lastPoint: { x: number; y: number };

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number
    ) {
        this.ctx = ctx;
        this.firstPoint = { ...point };
        this.lastPoint = { ...point };
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.shape = new Path2D();
        this.updateShape();
    }

    private updateShape(): void {
        this.shape = new Path2D();
        this.shape.moveTo(this.firstPoint.x, this.firstPoint.y);
        this.shape.lineTo(this.lastPoint.x, this.lastPoint.y);
    }

    draw(): void {
        this.updateShape();

        if (this.lineWidth <= 0) return;

        this.ctx.save();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.stroke(this.shape);
        this.ctx.restore();
    }

    contains(x: number, y: number): boolean {
        if (this.lineWidth <= 0) return false;

        this.updateShape();
        this.ctx.save();

        // Une tolérance facilite la sélection d'une ligne fine.
        this.ctx.lineWidth = Math.max(this.lineWidth, 8);
        this.ctx.lineCap = "round";

        const result = this.ctx.isPointInStroke(this.shape, x, y);

        this.ctx.restore();
        return result;
    }

    move(dx: number, dy: number): void {
        this.firstPoint.x += dx;
        this.firstPoint.y += dy;
        this.lastPoint.x += dx;
        this.lastPoint.y += dy;
        this.updateShape();
    }

    update(x: number, y: number): void {
        this.lastPoint = { x, y };
        this.updateShape();
    }

    duplicate(): CanvasItem {
        const copy = new LineItem(
            this.ctx,
            this.firstPoint,
            this.fillStyle,
            this.strokeStyle,
            this.lineWidth
        );

        copy.lastPoint = { ...this.lastPoint };
        copy.updateShape();

        return copy;
    }
}