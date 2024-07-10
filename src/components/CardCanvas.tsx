import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { Box, Button, Center, Divider, Text } from "@prismane/core";
import * as showdown from 'showdown';
import html2canvas from "html2canvas";
import { Download } from "@phosphor-icons/react";

export const CardCanvas = observer(() => {
    const store = useStore();

    const px = (x: number) => x.toString() + 'px';

    const borderColor = store.settingsStore.data.background.borderColor;
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

    return (
        <div>
            <div id='canvas-capture' style={{ width: px(store.settingsStore.data.background.width) }}>
                <Box bg={backgroundColor} w={px(width)} h={px(height)} bd={px(borderWidth) + ' solid ' + borderColor} >
                    <Center>
                        <div style={{ display: 'flex', flexDirection: 'column', maxHeight: px(height - foregroundMargin * 2), marginTop: px(foregroundMargin) }}>
                            {
                                selectedImage != null
                                    ? <img
                                        src={store.settingsStore.data.operational.readyImages[selectedImage]}
                                        width={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                        height="400px" style={{ objectFit: 'cover', border: `${px(foregroundBorderWidth)} solid ${foregroundBorderColor}` }} />
                                    : <div />
                            }
                            <Box
                                bg={foregroundColor}
                                w={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                h={px(height - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                                mt={px(foregroundMargin)}
                                bd={px(foregroundBorderWidth) + ' solid ' + foregroundBorderColor}
                                style={{ backgroundImage: `linear-gradient(0deg, ${foregroundColor} ,transparent), url("${foregroundImage}")` }}>

                                <Center>
                                    <Text cl={titleColor} as='h2' mt='10px'>{title}</Text>
                                </Center>
                                <Divider variant='dotted' />
                                <div style={{ marginLeft: (15 + contentFontSize).toString() + 'px', marginRight: (15).toString() + 'px', fontSize: contentFontSize.toString() + 'pt' }} dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
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