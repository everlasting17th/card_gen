import { TextEditField } from "@/components/common/TextEditField";
import { TextareEditField } from "@/components/common/TextareaEditField";
import { useStore } from "@/store/store";
import { observer } from "mobx-react-lite";

export const OpenAITab = observer(() => {
    const store = useStore();
    return (
        <div style={{ width: '100%' }}>
            <TextEditField
                label='Open AI key'
                type="text"
                value={store.settingsStore.data.settings.openAi.key}
                onValueChange={(value) => store.settingsStore.data.settings.openAi.key = value}
            />
            <TextareEditField
                label="Open AI prompt"
                value={store.settingsStore.data.settings.openAi.prompt}
                onValueChange={(value) => store.settingsStore.data.settings.openAi.prompt = value}
                height={500}
            />
            <TextareEditField
                label="Open AI MD format prompt"
                value={store.settingsStore.data.settings.openAi.formatPrompt}
                onValueChange={(value) => store.settingsStore.data.settings.openAi.formatPrompt = value}
                height={200}
            />
        </div>
    );
});