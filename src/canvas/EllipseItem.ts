import type { CanvasItem } from "./CanvasItem";

export class EllipseItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    firstPoint: { x: number; y: number };
    wh: { x: number; y: number };

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number
    ) {
        this.ctx = ctx;
        this.firstPoint = { ...point };
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.wh = { x: 0, y: 0 };
        this.shape = new Path2D();
        this.updateShape();
    }

    private updateShape(): void {
        this.shape = new Path2D();

        const centerX = this.firstPoint.x + this.wh.x / 2;
        const centerY = this.firstPoint.y + this.wh.y / 2;

        this.shape.ellipse(
            centerX,
            centerY,
            Math.abs(this.wh.x) / 2,
            Math.abs(this.wh.y) / 2,
            0,
            0,
            Math.PI * 2
        );
    }

    draw(): void {
        this.updateShape();
        this.ctx.save();

        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fill(this.shape);

        if (this.lineWidth > 0) {
            this.ctx.strokeStyle = this.strokeStyle;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.stroke(this.shape);
        }

        this.ctx.restore();
    }

    contains(x: number, y: number): boolean {
        this.updateShape();

        if (this.ctx.isPointInPath(this.shape, x, y)) {
            return true;
        }

        if (this.lineWidth > 0) {
            this.ctx.save();
            this.ctx.lineWidth = this.lineWidth;

            const onBorder = this.ctx.isPointInStroke(
                this.shape,
                x,
                y
            );

            this.ctx.restore();
            return onBorder;
        }

        return false;
    }

    move(dx: number, dy: number): void {
        this.firstPoint.x += dx;
        this.firstPoint.y += dy;
        this.updateShape();
    }

    update(x: number, y: number): void {
        this.wh.x = x - this.firstPoint.x;
        this.wh.y = y - this.firstPoint.y;
        this.updateShape();
    }

    duplicate(): CanvasItem {
        const copy = new EllipseItem(
            this.ctx,
            this.firstPoint,
            this.fillStyle,
            this.strokeStyle,
            this.lineWidth
        );

        copy.wh = { ...this.wh };
        copy.updateShape();

        return copy;
    }
}