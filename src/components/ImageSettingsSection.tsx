import { observer } from "mobx-react-lite";
import { TextareEditField } from "./TextareaEditField";
import { useStore } from "../store/store";
import { Box, Button, Flex, Modal, Grid, Text, Spinner, Skeleton } from "@prismane/core";
import { Pen } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { TextEditField } from "./TextEditField";
import { OpenAiLogo, PaintBrush } from "@phosphor-icons/react";
import { openAiCompletion } from "../api/openai.api";
import * as comfyApi from '../api/comfy.api'
import { useInterval } from "usehooks-ts";

export const ImageSettingsSection = observer(() => {
    const store = useStore();

    const [isApiConfigOpen, setApiConfigOpen] = useState<boolean>(false);
    const [isOpenAiBusy, setIsOpenAiBusy] = useState<boolean>(false);

    const canGeneratePropmpt = (): boolean => store.settingsStore.openAiKey != '' && store.settingsStore.openAiPrompt != '' && !isOpenAiBusy;
    const canGenerateImage = (): boolean => store.settingsStore.comfyUrl != '' && store.settingsStore.comfyPipeline != '';

    const generateImage = async () => {
        const positive = store.settingsStore.fullImagePrompt.replace('{0}', store.settingsStore.imagePrompt).trim().replaceAll('\n', ' ');

        const prompt = store.settingsStore.comfyPipeline
            .replaceAll('!positive_prompt!', positive)
            .replaceAll('!negative_prompt!', store.settingsStore.imageNegativePrompt.trim().replaceAll('\n', ' '))
            .replaceAll('!random_seed!', Math.floor(Math.random() * 100000000).toString());

        const response = await comfyApi.prompt(store.settingsStore.comfyUrl, '123', prompt);
        const result = await response.json();

        const promptId: string = result.prompt_id;

        store.settingsStore.awaitedPrompts.push({ promptId: promptId });
    }

    const generatePrompt = async () => {
        setIsOpenAiBusy(true);

        const prompt = store.settingsStore.openAiPrompt.replace('{0}', store.settingsStore.contentTitle + '\n' + store.settingsStore.contentBody);

        const response = await openAiCompletion(store.settingsStore.openAiKey, prompt);
        const res = await response.json();

        const choice = res.choices[0];

        store.settingsStore.imagePrompt = choice.message.content.replace('Tags:', '').trim();
        setIsOpenAiBusy(false);
    }

    useInterval(async () => {
        if (store.settingsStore.awaitedPrompts.length == 0) {
            return;
        }

        const res = await Promise.all(
            store.settingsStore.awaitedPrompts.map(async (prompt) => [await (await comfyApi.getHistory(store.settingsStore.comfyUrl, prompt.promptId)).json(), prompt.promptId])
        );

        const filesToDownload: { filename: string, subfolder: string }[] = [];

        res.forEach(response => {
            const promptId = response[1];
            if (response[0][promptId] != undefined) {
                // contains response
                const responseObj = response[0][promptId];

                store.settingsStore.awaitedPrompts.splice(store.settingsStore.awaitedPrompts.indexOf(promptId), 1);

                const outputs = Object.keys(responseObj.outputs);

                outputs.forEach((output) => {
                    responseObj.outputs[output].images.forEach((image: any) => {
                        filesToDownload.push({ filename: image.filename, subfolder: image.subfolder })
                    })
                })
            }
        })

        if (filesToDownload.length > 0) {
            // store.settingsStore.downloadingBlobs += filesToDownload.length;

            // const files = await Promise.all(filesToDownload.map(async (file) => await (await comfyApi.downloadImage(store.settingsStore.comfyUrl, file.filename, '', 'temp')).blob()));
            // files.forEach((file) => {
            //     store.settingsStore.donwloadedBlobs.push(file);
            // })

            // store.settingsStore.downloadingBlobs -= filesToDownload.length;
            filesToDownload.forEach((file) => {
                store.settingsStore.readyImages.push(`${store.settingsStore.comfyUrl}/view?filename=${file.filename}&type=temp`);
            });
        }

    }, 3000);

    const urlCreator = window.URL || window.webkitURL;

    return (
        <div>
            <Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
                <Button color='teal' onClick={() => setApiConfigOpen(true)} icon={<Pen />}>Configure API</Button>
                <Button color='copper' icon={<OpenAiLogo />} disabled={!canGeneratePropmpt()} onClick={async () => await generatePrompt()}> Generate Prompt</Button>
            </Flex>
            <TextareEditField
                label="Image prompt"
                value={store.settingsStore.imagePrompt}
                onValueChange={(value) => store.settingsStore.imagePrompt = value}
                height={100}
            />
            <Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
                <Button color='green' icon={<PaintBrush />} disabled={!canGenerateImage()} onClick={async () => await generateImage()}>Generate Image</Button>
            </Flex>
            <Grid templateColumns={3} w='100%' gap='15px'>
                {
                    Array(store.settingsStore.downloadingBlobs + store.settingsStore.awaitedPrompts.length).fill(0).map((k: number, i: number) => {
                        return (
                            <Grid.Item w='100%' key={i}>
                                <Skeleton w={200} h={200} />
                            </Grid.Item>)
                    })
                }
                {
                    store.settingsStore.readyImages.map((blob, i) => {
                        return (
                            <Grid.Item w='100%' key={i} bd={store.settingsStore.selectedImage == i ? '2px solid white' : ''}>
                                <img style={{ maxWidth: '200px' }} src={blob} onClick={() => {
                                    console.log(i);
                                    store.settingsStore.selectedImage = i;
                                }} />
                            </Grid.Item>
                        )
                    })
                }
            </Grid>

            <Modal open={isApiConfigOpen} onClose={() => setApiConfigOpen(false)} closable>
                <Box w='800px'>
                    <TextEditField
                        label='Open AI key'
                        type="text"
                        value={store.settingsStore.openAiKey}
                        onValueChange={(value) => store.settingsStore.openAiKey = value}
                    />
                    <TextareEditField
                        label="Open AI prompt"
                        value={store.settingsStore.openAiPrompt}
                        onValueChange={(value) => store.settingsStore.openAiPrompt = value}
                        height={500}
                    />
                    <TextEditField
                        label='Comfy Url'
                        type="text"
                        value={store.settingsStore.comfyUrl}
                        onValueChange={(value) => store.settingsStore.comfyUrl = value}
                    />
                    <TextareEditField
                        label="Image prompt"
                        value={store.settingsStore.fullImagePrompt}
                        onValueChange={(value) => store.settingsStore.fullImagePrompt = value}
                        height={150}
                    />
                    <TextareEditField
                        label="Negative prompt"
                        value={store.settingsStore.imageNegativePrompt}
                        onValueChange={(value) => store.settingsStore.imageNegativePrompt = value}
                        height={100}
                    />
                    <TextareEditField
                        label="Comfy pipeline"
                        value={store.settingsStore.comfyPipeline}
                        onValueChange={(value) => store.settingsStore.comfyPipeline = value}
                        height={200}
                    />
                </Box>
            </Modal>
        </div>
    )
})