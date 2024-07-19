import { Modal, Box, Tabs } from "@prismane/core";
import { observer } from "mobx-react-lite";
import { OpenAITab } from "./modal/OpenAITab";
import { ComfyUITab } from "./modal/ComfyUITab";
import { PipelinesTab } from "./modal/PipelinesTab";
import { PresetsTab } from "./modal/PresetsTab";

interface IProps {
    open: boolean;
    onClose: () => void
}

export const ImageSettingsModal = observer((props: IProps) => {
    return (
        <Modal style={{ maxHeight: '1200px', overflowY: 'auto', overflowX: 'hidden' }} open={props.open} onClose={() => props.onClose()} closable>
            <Box w='1000px' mih="900px">
                <Tabs defaultValue="openAi">
                    <Tabs.List>
                        <Tabs.Tab value="openAi">Open AI</Tabs.Tab>
                        <Tabs.Tab value="comfyUi">Comfy UI</Tabs.Tab>
                        <Tabs.Tab value="pipelines">Pipelines</Tabs.Tab>
                        <Tabs.Tab value='presets'>Presets</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="openAi">
                        <OpenAITab />
                    </Tabs.Panel>
                    <Tabs.Panel value="comfyUi">
                        <ComfyUITab />
                    </Tabs.Panel>
                    <Tabs.Panel value="pipelines">
                        <PipelinesTab />
                    </Tabs.Panel>
                    <Tabs.Panel value="presets">
                        <PresetsTab />
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </Modal>
    );
});