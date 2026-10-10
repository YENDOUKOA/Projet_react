import { useState } from "react";
import type { PersistentElements } from "./PersistentElement";
import type { Mode } from "./mode/Mode";
import { RectangleMode } from "./mode/RectangleMode";
import { SelectMoveMode } from "./mode/SelectMoveMode";
import "./Toolbar.css";
import { EllipseMode } from "./mode/EllipseMode";
import { LineMode } from "./mode/LineMode";
import { PencilMode } from "./mode/PencilMode";

type ToolbarProps = {
    persistentElements: PersistentElements | null;
    setCurrentMode: (mode: Mode) => void;
};

type Tool = {
    id: string;
    label: string;
    createMode: (
        elements: PersistentElements,
        refresh: () => void
    ) => Mode;
};

const tools: Tool[] = [
    {
        id: "move",
        label: "Select&Move",
        createMode: (elements, refresh) =>
            new SelectMoveMode(elements, refresh)
    },
    {
    id: "pencil",
    label: "Pencil",
    createMode: (elements) => new PencilMode(elements)
},
    {
        id: "line",
        label: "Line",
        createMode: (elements) => new LineMode(elements)
    },
    {
        id: "rectangle",
        label: "Rectangle",
        createMode: (elements) => new RectangleMode(elements)
    },
    {
    id: "ellipse",
    label: "Ellipse",
    createMode: (elements) => new EllipseMode(elements)
}
];

function Toolbar({
    persistentElements,
    setCurrentMode
}: ToolbarProps) {
    const [selectedTool, setSelectedTool] = useState("move");
    const [, setRevision] = useState(0);

    // Actualiser les valeurs affichées dans la barre d'outils.
    function refresh(): void {
        setRevision((revision) => revision + 1);
    }

    function selectTool(tool: Tool): void {
        if (!persistentElements) return;

        setSelectedTool(tool.id);
        setCurrentMode(tool.createMode(persistentElements, refresh));

        console.log(`Outil sélectionné : ${tool.label}`);
    }

    function handleDelete(): void {
        persistentElements?.removeSelectedItem();
        refresh();
    }

    function handleClone(): void {
        persistentElements?.duplicateSelectedItem();
        refresh();
    }

    return (
        <div id="toolbar">
            <fieldset>
                <legend>Tools</legend>

                {tools.map((tool) => (
                    <div key={tool.id}>
                        <input
                            type="radio"
                            id={tool.id}
                            name="tool"
                            value={tool.id}
                            checked={selectedTool === tool.id}
                            disabled={!persistentElements}
                            onChange={() => selectTool(tool)}
                        />

                        <label htmlFor={tool.id}>
                            {tool.label}
                        </label>
                    </div>
                ))}
            </fieldset>

            <fieldset>
                <legend>Style</legend>

                <table>
                    <tbody>
                        <tr>
                            <td>
                                <label htmlFor="background-color">
                                    Fill color:
                                </label>
                            </td>

                            <td>
                                <input
                                    className="input-color"
                                    type="color"
                                    id="background-color"
                                    value={
                                        persistentElements?.fillStyle
                                        ?? "#0d00ff"
                                    }
                                    disabled={!persistentElements}
                                    onChange={(event) => {
                                        persistentElements?.setFillStyle(
                                            event.target.value
                                        );
                                        refresh();
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="foreground-color">
                                    Outline:
                                </label>
                            </td>

                            <td>
                                <input
                                    className="input-color"
                                    type="color"
                                    id="foreground-color"
                                    value={
                                        persistentElements?.strokeStyle
                                        ?? "#000000"
                                    }
                                    disabled={!persistentElements}
                                    onChange={(event) => {
                                        persistentElements?.setStrokeStyle(
                                            event.target.value
                                        );
                                        refresh();
                                    }}
                                />
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <label htmlFor="line-width">
                                    Line width:
                                </label>
                            </td>

                            <td>
                                <input
                                    className="input-width"
                                    type="number"
                                    id="line-width"
                                    min="0"
                                    max="10"
                                    value={
                                        persistentElements?.lineWidth ?? 2
                                    }
                                    disabled={!persistentElements}
                                    onChange={(event) => {
                                        persistentElements?.setLineWidth(
                                            event.target.valueAsNumber
                                        );
                                        refresh();
                                    }}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </fieldset>

            <fieldset className="actions-fieldset">
                <legend>Actions</legend>

                <button
                    id="delete-button"
                    type="button"
                    disabled={!persistentElements}
                    onClick={handleDelete}
                >
                    Delete
                </button>

                <button
                    id="clone-button"
                    type="button"
                    disabled={!persistentElements}
                    onClick={handleClone}
                >
                    Clone
                </button>
            </fieldset>
        </div>
    );
}

export default Toolbar;