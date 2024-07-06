import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useRef } from "react";
import { Box, Center, Text } from "@prismane/core";
import * as showdown from 'showdown';

export const CardCanvas = observer(() => {
    const store = useStore();

    const px = (x: number) => x.toString() + 'px';

    const borderColor = store.settingsStore.borderColor;
    const backgroundColor = store.settingsStore.backgroundColor;
    const borderWidth = store.settingsStore.borderWidth;
    const width = store.settingsStore.width - borderWidth * 2;
    const height = store.settingsStore.height - borderWidth * 2;
    const foregroundColor = store.settingsStore.foregroundColor;
    const foregroundMargin = store.settingsStore.foregroundMargin;
    const foregroundBorderWidth = store.settingsStore.foregroundBorderWidth;
    const foregroundBorderColor = store.settingsStore.foregroundBorderColor;

    const title = store.settingsStore.contentTitle;
    const titleColor = store.settingsStore.contentTitleColor;

    const content = store.settingsStore.contentBody;
    const converter = new showdown.Converter();
    const contentHtml = converter.makeHtml(content);

    const contentFontSize = store.settingsStore.contentFontSize;
    const selectedImage = store.settingsStore.selectedImage;

    const urlCreator = window.URL || window.webkitURL;

    return (
        <div id='canvas-capture'>
            <Box bg={backgroundColor} w={px(width)} h={px(height)} bd={px(borderWidth) + ' solid ' + borderColor} >
                <Center>
                    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: px(height - foregroundMargin * 2), marginTop: px(foregroundMargin) }}>
                        {
                            selectedImage != null
                                ? <img
                                    src={store.settingsStore.readyImages[selectedImage]}
                                    width={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                    height="400px" style={{ objectFit: 'cover', border: `${px(foregroundBorderWidth)} solid ${foregroundBorderColor}` }} />
                                : <div />
                        }
                        <Box
                            bg={foregroundColor}
                            w={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                            h={px(height - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                            mt={px(foregroundMargin)}
                            bd={px(foregroundBorderWidth) + ' solid ' + foregroundBorderColor}>

                            <Center>
                                <Text cl={titleColor} as='h2' mt='10px'>{title}</Text>
                            </Center>
                            <div style={{ marginLeft: (15 + contentFontSize).toString() + 'px', fontSize: contentFontSize.toString() + 'pt' }} dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
                        </Box>
                    </div>
                </Center>
            </Box>
        </div >
    );
})