import { TextEditField } from "@/components/common/TextEditField";
import { TextareEditField } from "@/components/common/TextareaEditField";
import { useStore } from "@/store/store";
import { observer } from "mobx-react-lite";

export const ComfyUITab = observer(() => {
    const store = useStore();

    return (
        <div style={{ width: '100%' }}>
            <TextEditField
                label='Comfy Url'
                type="text"
                value={store.settingsStore.data.settings.comfy.url}
                onValueChange={(value) => store.settingsStore.data.settings.comfy.url = value}
            />
            <TextareEditField
                label="Image prompt"
                value={store.settingsStore.data.settings.comfy.fullPrompt}
                onValueChange={(value) => store.settingsStore.data.settings.comfy.fullPrompt = value}
                height={300}
            />
            <TextareEditField
                label="Negative prompt"
                value={store.settingsStore.data.settings.comfy.negativePrompt}
                onValueChange={(value) => store.settingsStore.data.settings.comfy.negativePrompt = value}
                height={300}
            />
        </div>
    );
});