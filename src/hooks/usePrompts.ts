import { useStore } from "@/store/store"

export const usePrompts = () => {
    const store = useStore();

    return {
        getPositivePrompt: (): string => {
            return store.settingsStore.data.settings.comfy.fullPrompt.replace('{0}', store.settingsStore.data.image.prompt).trim().replaceAll('\n', ' ');
        },
        getNegativePrompt: (): string => {
            return store.settingsStore.data.settings.comfy.negativePrompt.trim().replaceAll('\n', ' ');
        }
    };
}