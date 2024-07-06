import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { makePersistable } from "mobx-persist-store";

export class SettingsStore {
    @observable width: number = 600;
    @observable height: number = 1000;
    @observable borderWidth: number = 20;

    @observable backgroundColor: string = '#202121';
    @observable borderColor: string = '#000000';

    @observable foregroundColor: string = '#d8d8d7';
    @observable foregroundMargin: number = 20;
    @observable foregroundBorderColor: string = '#c5a062';
    @observable foregroundBorderWidth: number = 5;

    @observable contentTitle: string = '';
    @observable contentTitleColor: string = '#de2525';
    @observable contentBody: string = '';
    @observable contentFontSize: number = 16;

    @observable imagePrompt: string = '';
    @observable openAiKey: string = '';
    @observable openAiPrompt: string = '';

    @observable comfyUrl: string = '';
    @observable fullImagePrompt: string = '';
    @observable imageNegativePrompt: string = '';
    @observable comfyPipeline: string = '';

    @observable awaitedPrompts: { promptId: string }[] = []
    @observable donwloadedBlobs: Blob[] = [];
    @observable readyImages: string[] = [];
    @observable downloadingBlobs: number = 0;
    @observable selectedImage: number | null = null;

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
        makePersistable(this, {
            name: 'SettingsStore',
            properties: [
                'width',
                'height',
                'borderWidth',
                'backgroundColor',
                'borderColor',
                'foregroundColor',
                'foregroundMargin',
                'foregroundBorderColor',
                'foregroundBorderWidth',
                'contentTitle',
                'contentTitleColor',
                'contentBody',
                'contentFontSize',
                'imagePrompt',
                'openAiKey',
                'openAiPrompt',
                'comfyUrl',
                'fullImagePrompt',
                'imageNegativePrompt',
                'comfyPipeline'
            ],
            storage: window.localStorage
        })
    }
}