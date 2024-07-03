import { observer } from "mobx-react-lite";
import { Canvas } from "react-canvas-typescript";
import { useStore } from "../store/store";

export const CardCanvas = observer(() => {
    const store = useStore();

    const draw = (ctx: CanvasRenderingContext2D, frameCount: any, elapsedTime: any) => {
        const width = store.settingsStore.width;
        const height = store.settingsStore.height;

        ctx.fillStyle = store.settingsStore.borderColor;
        ctx.fillRect(0, 0, width, store.settingsStore.height);

        const borderWidth = store.settingsStore.borderWidth;
        ctx.fillStyle = store.settingsStore.backgroundColor;
        ctx.fillRect(borderWidth, borderWidth, width - borderWidth * 2, height - borderWidth * 2);
    }

    return (
        <Canvas width={store.settingsStore.width} height={store.settingsStore.height} contextType='2d' draw={draw} />
    );
})