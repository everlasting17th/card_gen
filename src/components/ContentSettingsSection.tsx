import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { TextEditField } from "./TextEditField";
import { ColorField } from "./ColorField";
import { TextareEditField } from "./TextareaEditField";
import { Flex, Button } from "@prismane/core";
import { OpenAiLogo } from "@phosphor-icons/react";
import { openAiCompletion } from "../api/openai.api";

export const ContentSettingsSection = observer(() => {
    const store = useStore();

    const formatMd = async () => {
        const prompt = `You will be given a text description of a skill or ability. Your task is to format this text to the markdown format. You can use any markdown features: bold, italic, list, colors, headers. Do not change original text, do not add anything. Please only respond with formatted text, no brackets or eny enclosing. \n ${store.settingsStore.data.content.body}`

        var response = await openAiCompletion(store.settingsStore.data.settings.openAi.key, prompt);
        const res = await response.json();

        const choice = res.choices[0];

        store.settingsStore.data.content.body = choice.message.content.trim();
    }

    return (
        <div >
            <TextEditField
                label='Title'
                type='text'
                value={store.settingsStore.data.content.title}
                onValueChange={(value) => { store.settingsStore.data.content.title = value }}
            />
            <ColorField
                label='Title color'
                value={store.settingsStore.data.content.titleColor}
                onValueChange={(value) => { store.settingsStore.data.content.titleColor = value }}
            />
            <TextareEditField
                label='Content'
                value={store.settingsStore.data.content.body}
                onValueChange={(value) => { store.settingsStore.data.content.body = value }}
                placeholder='You can use markdown here'
                height={500}
            />
            <Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
                <Button color='copper' icon={<OpenAiLogo />} onClick={async () => { await formatMd() }}> Format MD</Button>
            </Flex>
            <TextEditField
                label='Font size'
                type='number'
                value={store.settingsStore.data.content.fontSize.toString()}
                onValueChange={(value) => { store.settingsStore.data.content.fontSize = parseInt(value) }}
            />
        </div>
    )
})