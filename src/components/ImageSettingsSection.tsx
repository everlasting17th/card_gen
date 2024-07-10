import { observer } from "mobx-react-lite";
import { TextareEditField } from "./TextareaEditField";
import { useStore } from "../store/store";
import { Box, Button, Flex, Modal, Grid, Text, Spinner, Skeleton, TextField, usePrismaneColor, ActionButton, SelectField, TextareaField } from "@prismane/core";
import { Pen } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { TextEditField } from "./TextEditField";
import { GearSix, OpenAiLogo, PaintBrush, Plus, Trash } from "@phosphor-icons/react";
import { openAiCompletion } from "../api/openai.api";
import * as comfyApi from '../api/comfy.api'
import { useInterval } from "usehooks-ts";
import { useReadyImages } from "../hooks/useReadyImages";

export const ImageSettingsSection = observer(() => {
    const store = useStore();

    const [isApiConfigOpen, setApiConfigOpen] = useState<boolean>(false);
    const [isOpenAiBusy, setIsOpenAiBusy] = useState<boolean>(false);

    const { getSelectedImage, setSelectedImage, addImage, removeImage } = useReadyImages();


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

    const addPipeline = () => {
        store.settingsStore.data.settings.comfy.pipelines.push({
            name: '',
            pipeline: '',
            trigger: ''
        });
    }

    const removePipeline = (index: number) => {
        store.settingsStore.data.settings.comfy.pipelines.splice(index, 1);
    }

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
            <Flex gap='15px' wrap="wrap">
                {
                    store.settingsStore.data.operational.readyImages.map((url, i) => {
                        return (
                            <div key={i} style={{ width: '200px', height: '200px', position: 'relative' }}>
                                <img style={{ width: '100%', height: '100%', border: store.settingsStore.data.image.selectedImage == i ? '2px solid white' : '' }} src={url} onClick={() => {
                                    console.log(i);
                                    store.settingsStore.data.image.selectedImage = i;
                                }} />
                                <Button style={{ position: 'absolute', top: '10px', right: '10px' }} size="xs" bg={getColor('red', 600)} icon={<Trash />} onClick={() => removeImage(i)} />
                            </div>
                        )
                    })
                }
                {
                    Array(store.settingsStore.data.operational.awaitedPrompts.length).fill(0).map((k: number, i: number) => {
                        return (
                            <Skeleton w={200} h={200} key={i} />
                        )
                    })
                }
            </Flex>

            <Modal style={{ maxHeight: '1200px', overflowY: 'auto', overflowX: 'hidden' }} open={isApiConfigOpen} onClose={() => setApiConfigOpen(false)} closable>
                <Box w='800px'>
                    <Text as='h3'>General</Text>
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
                        height={100}
                    />
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
                        height={150}
                    />
                    <TextareEditField
                        label="Negative prompt"
                        value={store.settingsStore.data.settings.comfy.negativePrompt}
                        onValueChange={(value) => store.settingsStore.data.settings.comfy.negativePrompt = value}
                        height={100}
                    />
                    <Flex style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text as='h3'>Pipelines</Text>
                        <Button icon={<Plus />} onClick={() => addPipeline()}>Add Pipeline</Button>
                    </Flex>
                    {
                        store.settingsStore.data.settings.comfy.pipelines.length > 0
                            ? (
                                <Flex style={{ gap: '20px' }}>
                                    <Text w='240px' as='p' cl={getColor('coal', 400)}>Name</Text>
                                    <Text w='240px' as='p' cl={getColor('coal', 400)}>Trigger</Text>
                                    <Text w='240px' as='p' cl={getColor('coal', 400)}>Pipeline</Text>
                                </Flex>)
                            : (<div />)
                    }
                    {
                        store.settingsStore.data.settings.comfy.pipelines.map((pipeline, i) => {
                            return (
                                <Flex key={i} h='120px'>
                                    <TextEditField
                                        value={pipeline.name}
                                        type='text'
                                        onValueChange={(value) => pipeline.name = value}
                                    />
                                    <TextEditField
                                        value={pipeline.trigger}
                                        type='text'
                                        onValueChange={(value) => pipeline.trigger = value}
                                    />
                                    <TextareEditField
                                        value={pipeline.pipeline}
                                        height={40}
                                        placeholder="paste pipeline here"
                                        onValueChange={(value) => pipeline.pipeline = value}
                                    />
                                    <ActionButton mt='10px' size='xs' bg='red' icon={<Trash />} onClick={() => removePipeline(i)} />
                                </Flex>
                            )
                        })
                    }
                </Box>
            </Modal>
        </div>
    )
})