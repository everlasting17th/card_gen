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
                'foregroundBorderWidth'
            ],
            storage: window.localStorage
        })
    }
}