import { useEffect } from "react";
import type { RefObject } from "react";
import type { Mode } from "../mode/Mode";
import type { PersistentElements } from "../PersistentElement";
import "./Canvas.css";

type CanvasProps = {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    currentMode: Mode | null;
    persistentElements: PersistentElements | null;
};

function Canvas({
    canvasRef,
    currentMode,
    persistentElements
}: CanvasProps) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !persistentElements) return;

        function handleWheel(event: WheelEvent): void {
            event.preventDefault();

            // Vers le haut : avancer ; vers le bas : reculer.
            const direction = -Math.sign(event.deltaY);
            persistentElements?.changeDepth(direction);
        }

        // passive: false permet de bloquer le défilement de la page.
        canvas.addEventListener("wheel", handleWheel, {
            passive: false
        });

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
        };
    }, [canvasRef, persistentElements]);

    return (
        <div id="div-canvas">
            <canvas
                id="canvas"
                ref={canvasRef}
                onMouseDown={(event) => {
                    currentMode?.onMouseDown(event);
                }}
                onMouseMove={(event) => {
                    currentMode?.onMouseMove(event);
                }}
                onMouseUp={(event) => {
                    currentMode?.onMouseUp(event);
                }}
                onMouseLeave={(event) => {
                    currentMode?.onMouseUp(event);
                }}
            />
        </div>
    );
}

export default Canvas;