import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { useEffect, useRef } from "react";
import { Box, Center } from "@prismane/core";

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


    return (
        <div id='canvas-capture'>
            <Box bg={backgroundColor} w={px(width)} h={px(height)} bd={px(borderWidth) + ' solid ' + borderColor} >
                <Center>
                    <Box
                        bg={foregroundColor}
                        w={px(width - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                        h={px(height - foregroundMargin * 2 - foregroundBorderWidth * 2)}
                        mt={px(foregroundMargin)}
                        bd={px(foregroundBorderWidth) + ' solid ' + foregroundBorderColor}></Box>
                </Center>
            </Box>
        </div >
    );
})