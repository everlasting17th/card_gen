import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { TextEditField } from "./common/TextEditField";
import { ColorField } from "./common/ColorField";
import { TextareEditField } from "./common/TextareaEditField";
import { Flex, Button } from "@prismane/core";
import { OpenAiLogo } from "@phosphor-icons/react";
import { openAiCompletion } from "../api/openai.api";
import React from "react";

export const ContentSettingsSection = observer(() => {
    const store = useStore();

    const formatMd = async () => {
        const prompt = store.settingsStore.data.settings.openAi.formatPrompt.replace('{0}', store.settingsStore.data.content.body);

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
            <ColorField
                label='Table header'
                value={store.settingsStore.data.content.tableHeaderColor}
                onValueChange={(value) => { store.settingsStore.data.content.tableHeaderColor = value }}
            />
            <ColorField
                label='Table text'
                value={store.settingsStore.data.content.tableHeaderTextColor}
                onValueChange={(value) => { store.settingsStore.data.content.tableHeaderTextColor = value }}
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