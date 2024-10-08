import { observer } from "mobx-react-lite";
import { TextareEditField } from "../common/TextareaEditField";
import { useStore } from "../../store/store";
import { Box, Button, Flex, Modal, Grid, Text, Spinner, Skeleton, TextField, usePrismaneColor, ActionButton, SelectField, TextareaField, Accordion, Checkbox } from "@prismane/core";
import { Pen } from "@phosphor-icons/react/dist/ssr";
import { createRef, useState } from "react";
import { TextEditField } from "../common/TextEditField";
import { ArrowArcLeft, Eraser, GearSix, OpenAiLogo, PaintBrush, Plus, Trash } from "@phosphor-icons/react";
import { openAiCompletion } from "../../api/openai.api";
import * as comfyApi from '../../api/comfy.api'
import { useInterval } from "usehooks-ts";
import { useReadyImages } from "../../hooks/useReadyImages";
import { ImageItem } from "./ImageItem";
import { ImageThumbnail } from "./ImageThumbnail";
import { ImagesGrid } from "./ImagesGrid";
import { ImageSettingsModal } from "./ImageSettingsModal";
import { usePresets } from "@/hooks/usePresets";
import { usePrompts } from "@/hooks/usePrompts";
import CanvasDraw from "react-canvas-draw"
import { ColorField } from "../common/ColorField";
import html2canvas from "html2canvas";
import { delay } from "@/utils/delay";
import React from "react";

export const ImageSettingsSection = observer(() => {
    const store = useStore();

    const [isApiConfigOpen, setApiConfigOpen] = useState<boolean>(false);
    const [isOpenAiBusy, setIsOpenAiBusy] = useState<boolean>(false);

    const { getSelectedImage, setSelectedImage, addImage, removeImage, isImageSelected } = useReadyImages();
    const { getPresets, getSelectedPreset, setSelectedPreset, renderPreset } = usePresets();
    const { getPositivePrompt, getNegativePrompt } = usePrompts();

    const canGeneratePropmpt = (): boolean => store.settingsStore.data.settings.openAi.key != '' && store.settingsStore.data.settings.openAi.prompt != '' && !isOpenAiBusy;
    const canGenerateImage = (): boolean => store.settingsStore.data.settings.comfy.url != '' && store.settingsStore.data.image.selectedPresetId !== null;

    const [foregroundImgSrc, setForgroundImgSrc] = useState<string>('');

    const generateImage = async () => {
        const preset = getSelectedPreset();

        let imageData = '';

        if (store.settingsStore.data.image.controlNet.imageSrc != '') {
            const foregroundImageUrl = (controlNetCanvas?.current as any)?.getDataURL('image/png', true, '#FFFFFF');
            setForgroundImgSrc(foregroundImageUrl);

            await delay(100);

            const canvas = html2canvas(document.getElementById('canvasOperationRoot')!, { useCORS: true, allowTaint: true });
            imageData = (await canvas).toDataURL('image/png');
        } else {
            imageData = (controlNetCanvas?.current as any)?.getDataURL('image/png', false, '#FFFFFF');
        }

        const pipeline = renderPreset(
            preset!,
            {
                positive: getPositivePrompt(),
                negative: getNegativePrompt()
            },
            preset?.controlNetEnabled
                ? {
                    base64: imageData.replace('data:image/png;base64,', '') + '==',
                    strength: store.settingsStore.data.image.controlNet.strength
                }
                : undefined
        );

        if (!pipeline) {
            return
        }

        const response = await comfyApi.prompt(store.settingsStore.data.settings.comfy.url, '123', pipeline);
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

    const controlNetCanvas = createRef<CanvasDraw>();
    const canvasOperationRoot = createRef<HTMLDivElement>();

    return (
        <div>
            <div style={{ marginTop: '15px' }}>
                <Checkbox size="sm" label="Use Comfy UI"
                    checked={store.settingsStore.data.image.useComfyUi}
                    onChange={(e: any) => {
                        store.settingsStore.data.image.useComfyUi = e.target.checked
                    }}></Checkbox>
            </div>
            {
                store.settingsStore.data.image.useComfyUi
                    ? (<div><Flex mt='15px' mb='15px' w='100%' align='end' gap='10px' direction="row-reverse">
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
                                value={getSelectedPreset()?.name}
                                icon={<GearSix />}
                                placeholder="Choose a preset"
                                options={getPresets().map((preset) => { return { element: preset.name, value: preset.id } })}
                                style={{ maxWidth: '320px', height: '40px' }}
                                onChange={(e) => {
                                    setSelectedPreset(e.target.value)
                                }}
                            />
                        </Flex>
                        <Accordion>
                            {
                                getSelectedPreset()?.controlNetEnabled
                                    ? (
                                        <Accordion.Item bg={getColor('coal', 800)} value='controlnet'>
                                            <Accordion.Control>Control Net <Accordion.Icon /></Accordion.Control>
                                            <Accordion.Panel>
                                                <Flex w='100%' justify="end" gap='10px'>
                                                    <Box style={{ flexGrow: 1 }} miw='100px'>
                                                        <TextEditField
                                                            label="Strength"
                                                            type="number"
                                                            step={0.1}
                                                            min={0}
                                                            max={1}
                                                            value={store.settingsStore.data.image.controlNet.strength.toString()}
                                                            onValueChange={(value) => store.settingsStore.data.image.controlNet.strength = parseFloat(value)}
                                                        />
                                                        <ColorField
                                                            label='Brush color'
                                                            value={store.settingsStore.data.image.controlNet.brushColor}
                                                            onValueChange={(value) => store.settingsStore.data.image.controlNet.brushColor = value}
                                                        />
                                                        <TextEditField
                                                            label='Brush radius'
                                                            type='number'
                                                            value={store.settingsStore.data.image.controlNet.brushRadius.toString()}
                                                            onValueChange={(value) => store.settingsStore.data.image.controlNet.brushRadius = parseFloat(value)}
                                                        />
                                                        <TextEditField
                                                            label='Image src'
                                                            type='text'
                                                            value={store.settingsStore.data.image.controlNet.imageSrc}
                                                            onValueChange={(value) => store.settingsStore.data.image.controlNet.imageSrc = value}
                                                        />
                                                        <Flex w='100%' gap='10px'>
                                                            <Button color='base' icon={<ArrowArcLeft />} onClick={() => controlNetCanvas.current?.undo()}>Undo</Button>
                                                            <Button color='base' icon={<Eraser />} onClick={() => controlNetCanvas.current?.clear()}>Clear</Button>
                                                        </Flex>
                                                    </Box>
                                                    <CanvasDraw
                                                        ref={controlNetCanvas}
                                                        brushColor={store.settingsStore.data.image.controlNet.brushColor}
                                                        brushRadius={store.settingsStore.data.image.controlNet.brushRadius}
                                                        hideGrid={true}
                                                        canvasHeight={512}
                                                        canvasWidth={512}
                                                        imgSrc={store.settingsStore.data.image.controlNet.imageSrc}
                                                    />
                                                </Flex>
                                                <div style={{ position: 'absolute', top: -512, left: -512 }}>
                                                    <div style={{ position: 'relative' }} id='canvasOperationRoot'>
                                                        <img src={store.settingsStore.data.image.controlNet.imageSrc} height={512} width={512}></img>
                                                        <img style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }} src={foregroundImgSrc} height={512} width={512}></img>
                                                    </div>
                                                </div>
                                            </Accordion.Panel>
                                        </Accordion.Item>

                                    )
                                    : (<div />)
                            }

                            <Accordion.Item value='imagegrid'>
                                <Accordion.Control>Images <Accordion.Icon /></Accordion.Control>
                                <Accordion.Panel>
                                    <ImagesGrid />
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion >
                    </div>)
                    : (
                        <div>
                            <TextEditField
                                type="text"
                                value={store.settingsStore.data.image.directImageUrl}
                                label="Image Url"
                                onValueChange={(value) => store.settingsStore.data.image.directImageUrl = value}
                            />
                            <ColorField
                                label="Bg Color"
                                value={store.settingsStore.data.image.directImageBackground}
                                onValueChange={(value) => store.settingsStore.data.image.directImageBackground = value}
                            />
                        </div>)
            }

            <ImageSettingsModal
                open={isApiConfigOpen}
                onClose={() => setApiConfigOpen(false)}
            />
        </div >
    )
})