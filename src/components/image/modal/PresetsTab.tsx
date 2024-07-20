import { TextEditField } from "@/components/common/TextEditField";
import { TextFieldCompact } from "@/components/common/TextFieldCompact";
import { usePipelines } from "@/hooks/usePipelines";
import { usePresets } from "@/hooks/usePresets";
import { createUniqueId } from "@/utils/idUtils";
import { Gear, Plus, SelectionAll, Trash } from "@phosphor-icons/react";
import { Flex, Box, usePrismaneColor, Button, ActionButton, SelectField, Text, Checkbox, TextField } from "@prismane/core"
import { observer } from "mobx-react-lite";
import { useState } from "react";

export const PresetsTab = observer(() => {

    const { getColor } = usePrismaneColor();

    const { addPreset, removePreset, getPresets, getPreset } = usePresets();
    const { getPipeline, getPipelines, getLoras } = usePipelines();

    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

    const selectedPreset = selectedPresetId ? getPreset(selectedPresetId) : null;

    const pipelineLoras = selectedPreset?.pipelineId
        ? getLoras(selectedPreset.pipelineId)
        : [];

    if (selectedPreset) {
        pipelineLoras.forEach((lora) => {
            if (!Object.keys(selectedPreset.loras).includes(lora.pipelineKey)) {
                selectedPreset.loras[lora.pipelineKey] = {
                    name: lora.name,
                    enabled: lora.enabled,
                    value: lora.strength
                }
            }
        })
    }


    return (
        <Flex mih='900px' w='100%'>
            <Box bg={getColor('sepia', 900)} mih='600px' h='100%' miw='250px' w='250px' p='5px'>
                {
                    getPresets().map((preset, i) => (
                        <Flex gap='5px' mb='5px' key={i} w='100%'>
                            <Button
                                w='100%'
                                size='sm'
                                bg={selectedPresetId == preset.id ? getColor('green', 800) : getColor('gray', 700)}
                                onClick={() => setSelectedPresetId(preset.id)}>{preset.name}</Button>
                            <ActionButton size='xs' icon={<Trash />}
                                onClick={() => {
                                    removePreset(preset.id)

                                    if (selectedPresetId == preset.id) {
                                        setSelectedPresetId(null);
                                    }
                                }} />
                        </Flex>
                    ))
                }
                <Button w='100%' size='xs' icon={<Plus />} onClick={() => addPreset({
                    id: createUniqueId(),
                    name: 'New preset',
                    controlNetEnabled: false,
                    loras: {},
                })}>Add new</Button>
            </Box>
            {
                selectedPreset != null
                    ? (
                        <div style={{ width: '100%' }}>
                            <Box w='100%' p='15px'>
                                <TextEditField
                                    label="Name"
                                    type="text"
                                    value={selectedPreset.name}
                                    onValueChange={(value) => selectedPreset.name = value}
                                />
                                <Flex>
                                    <Text style={{ flexShrink: 0 }} w='120px' cl={getColor('coal', 400)} as='p'>Pipeline</Text>
                                    <SelectField
                                        size='xs'
                                        value={selectedPreset.pipelineId ? getPipeline(selectedPreset.pipelineId)?.name : ''}
                                        placeholder="Choose pipeline"
                                        icon={<Gear />}
                                        options={getPipelines().map((pipeline) => { return { element: pipeline.name, value: pipeline.id } })}
                                        onChange={(e) => {
                                            selectedPreset.pipelineId = e.target.value;
                                        }}
                                        style={{ marginLeft: '40px', marginRight: '40px' }}
                                    />
                                </Flex>
                                {
                                    selectedPreset.pipelineId != null
                                        ? (
                                            <div style={{ width: '100%' }}>
                                                <Checkbox
                                                    size='xs'
                                                    label='Use Control Net'
                                                    checked={selectedPreset.controlNetEnabled}
                                                    onChange={(e: any) => {
                                                        selectedPreset.controlNetEnabled = e.target.checked
                                                    }}
                                                />
                                                <Text as='p' mt='15px'>Loras</Text>
                                                <Box p='5px' mt='15px' mr='40px' bg={getColor('gray', 600)}>
                                                    {
                                                        Object.keys(selectedPreset.loras).map((loraId, i) => {
                                                            return (
                                                                <Flex style={{ alignItems: 'center' }} key={i}>
                                                                    <TextFieldCompact
                                                                        type='number'
                                                                        value={selectedPreset.loras[loraId].value.toString()}
                                                                        onValueChange={(value) => selectedPreset.loras[loraId].value = parseFloat(value)}
                                                                        step={0.1}
                                                                        min={0}
                                                                        max={1}
                                                                    />
                                                                    <Checkbox
                                                                        size='xs'
                                                                        label={selectedPreset.loras[loraId].name}
                                                                        checked={selectedPreset.loras[loraId].enabled}
                                                                        onChange={(e: any) => {
                                                                            selectedPreset.loras[loraId].enabled = e.target.checked;
                                                                        }}
                                                                    />
                                                                </Flex>
                                                            )
                                                        })
                                                    }
                                                </Box>
                                            </div>
                                        )
                                        : (<div />)
                                }
                            </Box>
                        </div>
                    )
                    : (<div />)
            }
        </Flex >
    )
});