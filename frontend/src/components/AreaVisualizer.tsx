import React, { useState, useEffect } from 'react';
import type {Rectangle} from "../common/types/Rectangle.ts";
const RectangleFittingVisualizer = () => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [rectangles, setRectangles] = useState<Rectangle[]>([]);
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, text: '' });

    const smallRect = { width: 1, height: 1.7 };
    const edgeMargin = 0.3;
    const spacing = 0.15;
    const scaleFactor = 100; // 1m = 100px

    const calculate = () => {
        const W = parseFloat(width);
        const H = parseFloat(height);

        if (isNaN(W) || isNaN(H) || W <= 0 || H <= 0) {
            setRectangles([]);
            return;
        }

        const usableWidth = W - 2 * edgeMargin;
        const usableHeight = H - 2 * edgeMargin;

        const countX = Math.floor((usableWidth + spacing) / (smallRect.width + spacing));
        const countY = Math.floor((usableHeight + spacing) / (smallRect.height + spacing));

        const newRectangles = [];

        for (let y = 0; y < countY; y++) {
            for (let x = 0; x < countX; x++) {
                const xPos = edgeMargin + x * (smallRect.width + spacing);
                const yPos = edgeMargin + y * (smallRect.height + spacing);
                newRectangles.push({
                    x: xPos,
                    y: yPos,
                    selected: false,
                });
            }
        }

        setRectangles(newRectangles);
        setContainerSize({ w: W, h: H });
    };

    const toggleSelection = (index) => {
        const updated = [...rectangles];
        updated[index].selected = !updated[index].selected;
        setRectangles(updated);
    };

    const handleContextMenu = (e, i) => {
        e.preventDefault();
        showTooltip(e.clientX, e.clientY, `Prawy klik na prostokąt #${i + 1}`);
    };

    const showTooltip = (clientX, clientY, text) => {
        setTooltip({
            visible: true,
            x: clientX + 10,
            y: clientY + 10,
            text,
        });
    };

    const hideTooltip = () => {
        setTooltip({ ...tooltip, visible: false });
    };

    const selectedCount = rectangles.filter((r) => r.selected).length;

    useEffect(() => {
        const handleClickOutside = () => hideTooltip();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div style={{ fontFamily: 'Arial', maxWidth: '600px', margin: 'auto' }}>
            <h2>Kalkulator i wizualizacja</h2>
            <div>
                <label>Szerokość (m): </label>
                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} step="0.01" />
            </div>
            <div>
                <label>Wysokość (m): </label>
                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} step="0.01" />
            </div>
            <button onClick={calculate} style={{ marginTop: '10px' }}>Oblicz i pokaż</button>

            {rectangles.length > 0 && (
                <div style={{ marginTop: '15px', fontWeight: 'bold' }}>
                    Zaznaczone prostokąty: {selectedCount}
                </div>
            )}

            <div style={{ marginTop: '20px', position: 'relative' }}>
                {rectangles.length > 0 && (
                    <div
                        style={{
                            position: 'relative',
                            width: containerSize.w * scaleFactor,
                            height: containerSize.h * scaleFactor,
                            border: '2px solid black',
                            backgroundColor: '#f9f9f9',
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                    >
                        {rectangles.map((rect, i) => (
                            <div
                                key={i}
                                onClick={() => toggleSelection(i)}
                                onContextMenu={(e) => handleContextMenu(e, i)}
                                onMouseMove={(e) => showTooltip(e.clientX, e.clientY, `Prostokąt #${i + 1}`)}
                                onMouseLeave={hideTooltip}
                                style={{
                                    position: 'absolute',
                                    left: rect.x * scaleFactor,
                                    top: rect.y * scaleFactor,
                                    width: smallRect.width * scaleFactor,
                                    height: smallRect.height * scaleFactor,
                                    backgroundColor: rect.selected ? '#4CAF50' : '#2196F3',
                                    border: '1px solid #333',
                                    cursor: 'pointer',
                                }}
                            />
                        ))}

                        {tooltip.visible && (
                            <div
                                style={{
                                    position: 'fixed',
                                    left: tooltip.x,
                                    top: tooltip.y,
                                    background: 'white',
                                    border: '1px solid #ccc',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
                                    pointerEvents: 'none',
                                    zIndex: 1000,
                                }}
                            >
                                {tooltip.text}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RectangleFittingVisualizer;
