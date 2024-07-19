import { usePipelines } from "@/hooks/usePipelines";
import { createUniqueId } from "@/utils/idUtils";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Alert, Button } from "@prismane/core";
import { observer } from "mobx-react-lite";
import { PipelineItem } from "./PipelineItem";

export const PipelinesTab = observer(() => {

    const bracket = (str: string) => `{${str}}`;

    const { addPipeline, removePipeline, getPipelines } = usePipelines();

    return (
        <div style={{ width: '100%' }}>
            <Alert icon={<div />} mt='15px' closable >
                <Alert.Title>Comfy UI Pipelines</Alert.Title>
                <Alert.Description>
                    To properly work with Comfy generation pipelines Card-Gen expects the following:
                    <ul>
                        <li>All prompt occurences should be replaced with '{bracket('positive_prompt')}'</li>
                        <li>All negative prompt occurences should be replaced with '{bracket('negative_prompt')}'</li>
                        <li>Use <b>PowerLoraLoader</b> node from <a target="_blank" href="https://github.com/rgthree/rgthree-comfy">rgthree</a> to load your loras. You can put many Loras there and tweak them in Presets tab</li>
                        <li>Use <b>LoadImage (Base64)</b> node from <a target="_blank" href="https://github.com/Acly/comfyui-tooling-nodes">comfyui-tooling-nodes</a> for your ControlNet image. Replace base64 text with '{bracket('controlnet_base64')}'</li>
                        <li>Replace control net strength with '{bracket('controlnet_strength')}'</li>
                        <li>See example Pipelines here</li>
                    </ul>
                </Alert.Description>
            </Alert>
            {
                getPipelines().map((pipeline, i) => {
                    return (<PipelineItem
                        key={i}
                        pipelineId={pipeline.id}
                        onRemoveClick={() => { removePipeline(pipeline.id) }}
                    />)
                })
            }
            <Button w='100%' size='xs' mt="15px" mb='30px' icon={<Plus />} onClick={() => addPipeline({ id: createUniqueId(), name: '', pipeline: '' })}>Add</Button>
        </div>
    );
})