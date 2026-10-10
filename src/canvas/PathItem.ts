import type { CanvasItem } from "./CanvasItem";

export class PathItem implements CanvasItem {
    public ctx: CanvasRenderingContext2D;
    public fillStyle: string;
    public strokeStyle: string;
    public lineWidth: number;
    public shape: Path2D;

    public points: { x: number; y: number }[];

    constructor(
        ctx: CanvasRenderingContext2D,
        point: { x: number; y: number },
        fillStyle: string,
        strokeStyle: string,
        lineWidth: number
    ) {
        this.ctx = ctx;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
        this.points = [{ ...point }];
        this.shape = new Path2D();
        this.updateShape();
    }

    private updateShape(): void {
        this.shape = new Path2D();

        const first = this.points[0];
        if (!first) return;

        this.shape.moveTo(first.x, first.y);

        for (let i = 1; i < this.points.length; i++) {
            this.shape.lineTo(
                this.points[i].x,
                this.points[i].y
            );
        }
    }

    draw(): void {
        this.updateShape();

        if (this.lineWidth <= 0) return;

        this.ctx.save();
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        this.ctx.stroke(this.shape);
        this.ctx.restore();
    }

    contains(x: number, y: number): boolean {
        if (this.lineWidth <= 0) return false;

        this.updateShape();
        this.ctx.save();

        // Faciliter la sélection des tracés fins.
        this.ctx.lineWidth = Math.max(this.lineWidth, 8);
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

        const result = this.ctx.isPointInStroke(
            this.shape,
            x,
            y
        );

        this.ctx.restore();
        return result;
    }

    move(dx: number, dy: number): void {
        this.points = this.points.map((point) => ({
            x: point.x + dx,
            y: point.y + dy
        }));

        this.updateShape();
    }

    update(x: number, y: number): void {
        const last = this.points[this.points.length - 1];

        // Ne pas ajouter deux fois le même point.
        if (last && last.x === x && last.y === y) return;

        this.points.push({ x, y });
        this.updateShape();
    }

    duplicate(): CanvasItem {
        const copy = new PathItem(
            this.ctx,
            this.points[0],
            this.fillStyle,
            this.strokeStyle,
            this.lineWidth
        );

        // Copier chaque point pour garder les tracés indépendants.
        copy.points = this.points.map((point) => ({ ...point }));
        copy.updateShape();

        return copy;
    }
}