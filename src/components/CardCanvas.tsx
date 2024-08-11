import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { Box, Button, Center, Divider, Text } from "@prismane/core";
import * as showdown from 'showdown';
import html2canvas from "html2canvas";
import { Download } from "@phosphor-icons/react";
import { backgroundImage } from "html2canvas/dist/types/css/property-descriptors/background-image";
import React, { createRef, useEffect } from "react";
import './CardCanvas.scss';

export const CardCanvas = observer(() => {
    const store = useStore();

    const px = (x: number) => x.toString() + 'px';

    const borderColor = store.settingsStore.data.background.borderColor;
    const backgroundAccentColor = store.settingsStore.data.background.accentColor;
    const backgroundColor = store.settingsStore.data.background.color;
    const borderWidth = store.settingsStore.data.background.borderWidth;
    const width = store.settingsStore.data.background.width - borderWidth * 2;
    const height = store.settingsStore.data.background.height - borderWidth * 2;
    const foregroundColor = store.settingsStore.data.foreground.color;
    const foregroundMargin = store.settingsStore.data.foreground.margin;
    const foregroundBorderWidth = store.settingsStore.data.foreground.borderWidth;
    const foregroundBorderColor = store.settingsStore.data.foreground.borderColor;
    const foregroundImage = store.settingsStore.data.foreground.imageUrl;

    const title = store.settingsStore.data.content.title;
    const titleColor = store.settingsStore.data.content.titleColor;

    const content = store.settingsStore.data.content.body;
    const converter = new showdown.Converter();
    converter.setOption('tables', true);
    const contentHtml = converter.makeHtml(content);

    const contentFontSize = store.settingsStore.data.content.fontSize;
    const selectedImage = store.settingsStore.data.image.selectedImage;

    const saveAsImage = async () => {
        const canvas = await html2canvas(document.querySelector('#canvas-capture')!, {
            useCORS: true,
            allowTaint: true
        });

        const link = document.getElementById('link');
        link!.setAttribute('download', `${title}.png`);
        link!.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
        link!.click();
    }

    const canvasCapture = createRef<HTMLDivElement>();

    const useComfyUi = store.settingsStore.data.image.useComfyUi;
    const directImageUrl = store.settingsStore.data.image.directImageUrl;
    const directImageBackgroundColor = store.settingsStore.data.image.directImageBackground;

    useEffect(() => {
        canvasCapture.current!.style.cssText = `
            --table-header-color: ${store.settingsStore.data.content.tableHeaderColor};
            --table-header-text-color: ${store.settingsStore.data.content.tableHeaderTextColor}
        `;
    }, [store.settingsStore.data.content.tableHeaderColor, store.settingsStore.data.content.tableHeaderTextColor]);

    return (
        <div>
            <div id='canvas-capture' style={{ width: px(store.settingsStore.data.background.width) }}>
                <Box bg={backgroundColor} w={px(width)} h={px(height)} bd={px(borderWidth) + ' solid ' + borderColor} >
                    <Center style={{ backgroundImage: `radial-gradient(circle, ${backgroundAccentColor} 0%, ${backgroundColor} 60%)` }}>
                        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: px(height - foregroundMargin * 2), marginTop: px(foregroundMargin) }}>
                            {
                                (selectedImage != null || !useComfyUi)
                                    ? <img
                                        src={useComfyUi ? store.settingsStore.data.operational.readyImages[selectedImage!] : directImageUrl}
                                        width={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                        height="400px"
                                        style={{ objectFit: 'cover', border: `${px(foregroundBorderWidth)} solid ${foregroundBorderColor}`, backgroundColor: directImageBackgroundColor }} />
                                    : <div />
                            }
                            <Box
                                bg={foregroundColor}
                                w={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                h={px(height - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                mt={(selectedImage != null || !useComfyUi) ? px(foregroundMargin) : 0}
                                bd={px(foregroundBorderWidth) + ' solid ' + foregroundBorderColor}
                                style={{ backgroundImage: `linear-gradient(0deg, ${foregroundColor} ,transparent), url("${foregroundImage}")` }}>

                                <Center>
                                    <Text cl={titleColor} as='h2' mt='10px'>{title}</Text>
                                </Center>
                                <Divider variant='dotted' />
                                <div className="canvas-capture__content" style={{ marginLeft: (15 + contentFontSize).toString() + 'px', marginRight: (15).toString() + 'px', fontSize: contentFontSize.toString() + 'pt' }} >
                                    <div ref={canvasCapture} dangerouslySetInnerHTML={{ __html: contentHtml }}>

                                    </div>
                                </div>
                            </Box>
                        </div>
                    </Center>
                </Box >
            </div >
            <Button mt='20px' icon={<Download />} onClick={async () => { await saveAsImage() }}>Download</Button>
            <a id="link"></a>
        </div >
    );
})