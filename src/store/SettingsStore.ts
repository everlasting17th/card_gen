import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { makePersistable } from "mobx-persist-store";
import { ComfyPipeline } from "../model/ComfyPipeline";
import { ComfyPreset } from "@/model/ComfyPreset";

export class SettingsStore {

    @observable data: {
        background: {
            width: number;
            height: number;
            borderWidth: number;
            color: string;
            borderColor: string;
            accentColor: string;
        },
        foreground: {
            color: string;
            margin: number;
            borderColor: string;
            borderWidth: number;
            imageUrl: string;
        },
        content: {
            title: string;
            name: string;
            titleColor: string;
            tableHeaderColor: string;
            tableHeaderTextColor: string;
            body: string;
            fontSize: number;
        },
        image: {
            useComfyUi: boolean;
            directImageUrl: string;
            directImageBackground: string;
            selectedPipeline: number | null;
            prompt: string
            selectedImage: number | null;
            selectedPresetId: string | null;
            controlNet: {
                strength: number;
                brushColor: string;
                brushRadius: number;
                imageSrc: string
            }
        },
        settings: {
            openAi: {
                key: string;
                prompt: string;
                formatPrompt: string;
            },
            comfy: {
                url: string;
                fullPrompt: string;
                negativePrompt: string;
                pipelines: ComfyPipeline[],
                presets: ComfyPreset[],
            }
        },
        operational: {
            awaitedPrompts: { promptId: string }[];
            readyImages: string[];
        }
    } = {
            background: {
                width: 600,
                height: 1000,
                borderWidth: 20,
                color: '#202121',
                borderColor: '#000000',
                accentColor: '#000000'
            },
            foreground: {
                color: '#d8d8d7',
                margin: 20,
                borderColor: '#c5a062',
                borderWidth: 5,
                imageUrl: '',
            },
            content: {
                title: '',
                name: '',
                titleColor: '#de2525',
                tableHeaderColor: '#FFFFFF',
                tableHeaderTextColor: '#000000',
                body: '',
                fontSize: 16
            },
            image: {
                useComfyUi: true,
                directImageUrl: '',
                directImageBackground: '#000000',
                prompt: '',
                selectedImage: null,
                selectedPipeline: null,
                selectedPresetId: null,
                controlNet: {
                    strength: 0,
                    brushColor: '#000000',
                    brushRadius: 8,
                    imageSrc: ''
                }
            },
            settings: {
                openAi: {
                    key: '',
                    prompt: '',
                    formatPrompt: ''
                },
                comfy: {
                    url: '',
                    fullPrompt: '',
                    negativePrompt: '',
                    pipelines: [],
                    presets: []
                }
            },
            operational: {
                awaitedPrompts: [],
                readyImages: []
            }
        }

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'SettingsStore',
            properties: [
                'data'
            ],
            storage: window.localStorage
        })
    }

    setData(data: any) {
        this.data = data;
    }
}