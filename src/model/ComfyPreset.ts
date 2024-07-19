export interface ComfyPreset {
    pipelineId: string;
    controlNetEnabled: boolean;
    loras: { [name: string]: { enabled: boolean, value: number } }
}