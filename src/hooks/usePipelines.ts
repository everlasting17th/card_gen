import { ComfyPipeline } from "@/model/ComfyPipeline";
import { useStore } from "@/store/store"

export const usePipelines = () => {
    const store = useStore();

    return {
        getPipelines: () => store.settingsStore.data.settings.comfy.pipelines,
        getPipeline: (id: string): ComfyPipeline | null => {
            const result = store.settingsStore.data.settings.comfy.pipelines.filter(x => x.id == id);
            return (result && result.length > 0) ? result[0] : null;
        },
        addPipeline: (pipeline: ComfyPipeline) => {
            store.settingsStore.data.settings.comfy.pipelines.push(pipeline)
        },
        removePipeline: (id: string) => {
            store.settingsStore.data.settings.comfy.pipelines = store.settingsStore.data.settings.comfy.pipelines.filter(x => x.id != id);
        }
    }
}