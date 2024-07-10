import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { makePersistable } from "mobx-persist-store";
import { ComfyPipeline } from "../model/ComfyPipeline";

export class SettingsStore {

    @observable data: {
        background: {
            width: number;
            height: number;
            borderWidth: number;
            color: string;
            borderColor: string;
        },
        foreground: {
            color: string;
            margin: number;
            borderColor: string;
            borderWidth: number;
        },
        content: {
            title: string;
            titleColor: string;
            body: string;
            fontSize: number;
        },
        image: {
            selectedPipeline: number | null;
            prompt: string
            selectedImage: number | null;
        },
        settings: {
            openAi: {
                key: string;
                prompt: string;
            },
            comfy: {
                url: string;
                fullPrompt: string;
                negativePrompt: string;
                pipelines: ComfyPipeline[],
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
                borderColor: '#000000'
            },
            foreground: {
                color: '#d8d8d7',
                margin: 20,
                borderColor: '#c5a062',
                borderWidth: 5
            },
            content: {
                title: '',
                titleColor: '#de2525',
                body: '',
                fontSize: 16
            },
            image: {
                prompt: '',
                selectedImage: null,
                selectedPipeline: null
            },
            settings: {
                openAi: {
                    key: '',
                    prompt: ''
                },
                comfy: {
                    url: '',
                    fullPrompt: '',
                    negativePrompt: '',
                    pipelines: []
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