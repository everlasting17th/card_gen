import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { makePersistable } from "mobx-persist-store";

export class SettingsStore {
    @observable width: number = 600;
    @observable height: number = 1000;
    @observable borderWidth: number = 2;

    @observable backgroundColor: string = '#FFFFFF';
    @observable borderColor: string = '#000000';

    @observable foregroundColor: string = '#FFFFFF';
    @observable foregroundMargin: number = 10;
    @observable foregroundBorderColor: string = '#000000';
    @observable foregroundBorderWidth: number = 2;

    @observable contentTitle: string = '';
    @observable contentTitleColor: string = '#000000';
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