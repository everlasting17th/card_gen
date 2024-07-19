import { ComfyPipeline } from "@/model/ComfyPipeline";
import { useStore } from "@/store/store"

export const usePipelines = () => {
    const store = useStore();

    const getPipeline = (id: string): ComfyPipeline | null => {
        const result = store.settingsStore.data.settings.comfy.pipelines.filter(x => x.id == id);
        return (result && result.length > 0) ? result[0] : null;
    }

    return {
        getPipelines: () => store.settingsStore.data.settings.comfy.pipelines,
        getPipeline: getPipeline,
        addPipeline: (pipeline: ComfyPipeline) => {
            store.settingsStore.data.settings.comfy.pipelines.push(pipeline)
        },
        removePipeline: (id: string) => {
            store.settingsStore.data.settings.comfy.pipelines = store.settingsStore.data.settings.comfy.pipelines.filter(x => x.id != id);
        },
        getLoras: (id: string): { pipelineKey: string, name: string, strength: number, enabled: boolean }[] => {
            const pipeline = getPipeline(id);

            if (!pipeline) {
                return [];
            }

            const data = JSON.parse(pipeline.pipeline);
            const node = data[Object.keys(data).filter((key) => data[key].class_type == 'Power Lora Loader (rgthree)')[0]];
            const inputs = node.inputs;

            return Object.keys(inputs).filter((key) => key.startsWith('lora'))
                .map((key) => {
                    return {
                        pipelineKey: key,
                        name: inputs[key].lora,
                        strength: inputs[key].strength,
                        enabled: inputs[key].on
                    }
                });
        }
    }
}