import { Alert, useToast } from "@prismane/core";
import { useStore } from "../store/store"

export const useCopySettings = () => {
    const store = useStore();
    const toast = useToast();

    return {
        copy: () => {
            const jsonData = JSON.stringify(store.settingsStore.data);
            navigator.clipboard.writeText(jsonData);
            alert('Copied!')
        },
        paste: async () => {
            const data = JSON.parse(await navigator.clipboard.readText());
            store.settingsStore.setData(data);
            alert('Pasted!')
        }
    }
}