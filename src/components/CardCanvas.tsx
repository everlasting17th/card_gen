import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useRef } from "react";

export const CardCanvas = observer(() => {
    const store = useStore();
    const canvasRef = useRef(null);

    const draw = (ctx: CanvasRenderingContext2D) => {
        const width = store.settingsStore.width;
        const height = store.settingsStore.height;

        ctx.fillStyle = store.settingsStore.borderColor;
        ctx.fillRect(0, 0, width, store.settingsStore.height);

        const borderWidth = store.settingsStore.borderWidth;
        ctx.fillStyle = store.settingsStore.backgroundColor;
        ctx.fillRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const context: CanvasRenderingContext2D = (canvas as any).getContext('2d');

        draw(context)
    }, [draw, ...Object.values(store.settingsStore)])

    return (
        <canvas ref={canvasRef} width={store.settingsStore.width} height={store.settingsStore.height} />
    );
})