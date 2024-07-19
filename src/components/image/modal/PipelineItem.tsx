import { TextEditField } from "@/components/common/TextEditField";
import { TextareEditField } from "@/components/common/TextareaEditField";
import { usePipelines } from "@/hooks/usePipelines";
import { Trash } from "@phosphor-icons/react";
import { ActionButton, Card, Flex, usePrismaneColor } from "@prismane/core";
import { observer } from "mobx-react-lite";

interface IProps {
    pipelineId: string;
    onRemoveClick: () => void;
}

export const PipelineItem = observer((props: IProps) => {
    const { getPipeline } = usePipelines();
    const { getColor } = usePrismaneColor();

    const pipeline = getPipeline(props.pipelineId);

    if (pipeline === null) {
        return (<div />)
    }

    return (
        <Card mt='10px' bg={getColor('sepia', 900)}>
            <Flex>
                <TextEditField
                    type="text"
                    value={pipeline.name}
                    onValueChange={(value) => pipeline.name = value}
                />
                <div style={{ flexGrow: 1 }}>
                    <TextareEditField
                        value={pipeline.pipeline}
                        onValueChange={(value) => pipeline.pipeline = value}
                        height={150}
                        placeholder="paste pipeline json here"
                    />
                </div>
                <ActionButton variant='primary' icon={<Trash />} onClick={() => props.onRemoveClick()} />
            </Flex>
        </Card>

    )
})