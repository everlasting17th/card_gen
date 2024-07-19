export interface ComfyPreset {
    id: string;
    name: string;
    pipelineId?: string;
    controlNetEnabled: boolean;
    loras: { [id: string]: { name: string; enabled: boolean, value: number } }
}