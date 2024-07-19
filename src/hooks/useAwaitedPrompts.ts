import { useStore } from "@/store/store"

export const useAwaitedPrompts = () => {
    const store = useStore();

    return {
        getAwaitedPrompts: () => store.settingsStore.data.operational.awaitedPrompts,
    }
}