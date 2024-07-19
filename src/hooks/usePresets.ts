import { ComfyPreset } from "@/model/ComfyPreset";
import { useStore } from "@/store/store";
import { usePipelines } from "./usePipelines";

export const usePresets = () => {
    const store = useStore();
    const { getPipeline } = usePipelines();

    const getPreset = (id: string): ComfyPreset | null => {
        const result = store.settingsStore.data.settings.comfy.presets.filter(x => x.id == id);
        return (result && result.length > 0) ? result[0] : null;
    };

    return {
        getPresets: (): ComfyPreset[] => {
            return store.settingsStore.data.settings.comfy.presets;
        },
        getPreset: getPreset,
        getSelectedPreset: (): ComfyPreset | null => {
            return store.settingsStore.data.image.selectedPresetId
                ? getPreset(store.settingsStore.data.image.selectedPresetId)
                : null;

        },
        setSelectedPreset: (id: string) => {
            store.settingsStore.data.image.selectedPresetId = id;
        },
        addPreset: (preset: ComfyPreset) => {
            store.settingsStore.data.settings.comfy.presets.push(preset);
        },
        removePreset: (id: string) => {
            store.settingsStore.data.settings.comfy.presets = store.settingsStore.data.settings.comfy.presets.filter(x => x.id != id);
        },
        renderPreset: (preset: ComfyPreset, prompt: { positive: string, negative: string }, controlNet?: { base64: string, strength: number }): string | null => {
            if (preset.pipelineId == null) { return null; }

            const pipeline = getPipeline(preset.pipelineId)!.pipeline;

            const data = JSON.parse(pipeline);
            const powerLoraKey = Object.keys(data).filter((key) => data[key].class_type == 'Power Lora Loader (rgthree)')[0];
            const powerLoraNode = data[powerLoraKey];

            const inputs = Object.keys(powerLoraNode.inputs).filter((key) => key.startsWith('lora'));

            inputs.forEach((input) => {
                if (Object.keys(preset.loras).includes(input)) {
                    powerLoraNode.inputs[input].on = preset.loras[input].enabled;
                    powerLoraNode.inputs[input].strength = preset.loras[input].value;
                }
            });

            data[powerLoraKey] = powerLoraNode;

            const strPipeline = JSON.stringify(data);
            return strPipeline
                .replaceAll(`{positive_prompt}`, prompt.positive)
                .replaceAll(`{negative_prompt}`, prompt.negative)
                .replaceAll(`{controlnet_base64}`, controlNet?.base64 ?? '')
                .replaceAll(`"{controlnet_strength}"`, (controlNet?.strength ?? 1).toString());
        }
    }
};