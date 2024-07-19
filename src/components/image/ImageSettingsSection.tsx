import { observer } from "mobx-react-lite";
import { TextareEditField } from "../common/TextareaEditField";
import { useStore } from "../../store/store";
import { Box, Button, Flex, Modal, Grid, Text, Spinner, Skeleton, TextField, usePrismaneColor, ActionButton, SelectField, TextareaField } from "@prismane/core";
import { Pen } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { TextEditField } from "../common/TextEditField";
import { GearSix, OpenAiLogo, PaintBrush, Plus, Trash } from "@phosphor-icons/react";
import { openAiCompletion } from "../../api/openai.api";
import * as comfyApi from '../../api/comfy.api'
import { useInterval } from "usehooks-ts";
import { useReadyImages } from "../../hooks/useReadyImages";
import { ImageItem } from "./ImageItem";
import { ImageThumbnail } from "./ImageThumbnail";
import { ImagesGrid } from "./ImagesGrid";
import { ImageSettingsModal } from "./ImageSettingsModal";

export const ImageSettingsSection = observer(() => {
    const store = useStore();

    const [isApiConfigOpen, setApiConfigOpen] = useState<boolean>(false);
    const [isOpenAiBusy, setIsOpenAiBusy] = useState<boolean>(false);

    const { getSelectedImage, setSelectedImage, addImage, removeImage, isImageSelected } = useReadyImages();


    const canGeneratePropmpt = (): boolean => store.settingsStore.data.settings.openAi.key != '' && store.settingsStore.data.settings.openAi.prompt != '' && !isOpenAiBusy;
    const canGenerateImage = (): boolean => store.settingsStore.data.settings.comfy.url != '' && store.settingsStore.data.image.selectedPipeline !== null;

    const generateImage = async () => {
        const positive = store.settingsStore.data.settings.comfy.fullPrompt.replace('{0}', store.settingsStore.data.image.prompt).trim().replaceAll('\n', ' ');

        const prompt = store.settingsStore.data.settings.comfy.pipelines[store.settingsStore.data.image.selectedPipeline!].pipeline
            .replaceAll('!positive_prompt!', positive)
            .replaceAll('!negative_prompt!', store.settingsStore.data.settings.comfy.negativePrompt.trim().replaceAll('\n', ' '))
            .replaceAll('!random_seed!', Math.floor(Math.random() * 100000000).toString());

        const response = await comfyApi.prompt(store.settingsStore.data.settings.comfy.url, '123', prompt);
        const result = await response.json();

        const promptId: string = result.prompt_id;

        store.settingsStore.data.operational.awaitedPrompts.push({ promptId: promptId });
    }

    const generatePrompt = async () => {
        setIsOpenAiBusy(true);

        const prompt = store.settingsStore.data.settings.openAi.prompt.replace('{0}', store.settingsStore.data.content.title + '\n' + store.settingsStore.data.content.body);

        const response = await openAiCompletion(store.settingsStore.data.settings.openAi.key, prompt);
        const res = await response.json();

        const choice = res.choices[0];

        store.settingsStore.data.image.prompt = choice.message.content.replace('Tags:', '').trim();
        setIsOpenAiBusy(false);
    }

    useInterval(async () => {
        if (store.settingsStore.data.operational.awaitedPrompts.length == 0) {
            return;
        }

        store.settingsStore.data.operational.awaitedPrompts =
            store.settingsStore.data.operational.awaitedPrompts.filter((x) => x.promptId);

        const res = await Promise.all(
            store.settingsStore.data.operational.awaitedPrompts.map(async (prompt) => [await (await comfyApi.getHistory(store.settingsStore.data.settings.comfy.url, prompt.promptId)).json(), prompt.promptId])
        );

        const filesToDownload: { filename: string, subfolder: string }[] = [];

        res.forEach(response => {
            const promptId = response[1];
            if (response[0][promptId] != undefined) {
                // contains response
                const responseObj = response[0][promptId];

                store.settingsStore.data.operational.awaitedPrompts.splice(store.settingsStore.data.operational.awaitedPrompts.indexOf(promptId), 1);

                const outputs = Object.keys(responseObj.outputs);

                outputs.forEach((output) => {
                    responseObj.outputs[output].images.forEach((image: any) => {
                        filesToDownload.push({ filename: image.filename, subfolder: image.subfolder })
                    })
                })
            }
        })

        if (filesToDownload.length > 0) {
            filesToDownload.forEach((file) => {
                addImage(`${store.settingsStore.data.settings.comfy.url}/view?filename=${file.filename}&type=temp`)
            });
        }

    }, 3000);


    const { getColor } = usePrismaneColor();


    return (
        <div>
            <Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
                <Button color='teal' onClick={() => setApiConfigOpen(true)} icon={<Pen />}>Configure API</Button>
                <Button color='copper' icon={<OpenAiLogo />} disabled={!canGeneratePropmpt()} onClick={async () => await generatePrompt()}> Generate Prompt</Button>
            </Flex>
            <TextareEditField
                label="Image prompt"
                value={store.settingsStore.data.image.prompt}
                onValueChange={(value) => store.settingsStore.data.image.prompt = value}
                height={100}
            />
            <Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
                <Button color='green' icon={<PaintBrush />} disabled={!canGenerateImage()} onClick={async () => await generateImage()}>Generate Image</Button>
                <SelectField
                    value={store.settingsStore.data.image.selectedPipeline !== null ? store.settingsStore.data.settings.comfy.pipelines[store.settingsStore.data.image.selectedPipeline].name : ''}
                    icon={<GearSix />}
                    placeholder="Choose a pipeline"
                    options={store.settingsStore.data.settings.comfy.pipelines.map((pipeline, i) => { return { element: pipeline.name, value: i.toString() } })}
                    style={{ maxWidth: '320px', height: '40px' }}
                    onChange={(e) => {
                        store.settingsStore.data.image.selectedPipeline = parseInt(e.target.value)
                    }}
                />
            </Flex>
            <ImagesGrid />
            <ImageSettingsModal
                open={isApiConfigOpen}
                onClose={() => setApiConfigOpen(false)}
            />
        </div>
    )
})