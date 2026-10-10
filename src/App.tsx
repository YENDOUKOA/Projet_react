import { useEffect, useRef, useState } from "react";
import { PersistentElements } from "./PersistentElement";
import type { Mode } from "./mode/Mode";
import { SelectMoveMode } from "./mode/SelectMoveMode";
import Canvas from "./canvas/Canvas";
import Toolbar from "./Toolbar";
import "./App.css";

function resizeCanvas(canvas: HTMLCanvasElement): void {
    const rect = canvas.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);

    if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
    }
}

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [persistentElements, setPersistentElements] =
        useState<PersistentElements | null>(null);

    const [currentMode, setCurrentMode] =
        useState<Mode | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            console.error("Canvas introuvable");
            return;
        }

        const ctx = canvas.getContext("2d");

        if (!ctx) {
            console.error("Contexte 2D indisponible");
            return;
        }

        resizeCanvas(canvas);

        const elements = new PersistentElements(
            canvas,
            ctx,
            "#0d00ff",
            "#000000",
            2
        );

        setPersistentElements(elements);
        setCurrentMode(new SelectMoveMode(elements, () => {}));

        function handleResize(): void {
            resizeCanvas(elements.canvas);
            elements.redraw();
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div id="main-div">
            <Toolbar
                persistentElements={persistentElements}
                setCurrentMode={setCurrentMode}
            />

            <Canvas
    canvasRef={canvasRef}
    currentMode={currentMode}
    persistentElements={persistentElements}
/>
        </div>
    );
}

export default App;