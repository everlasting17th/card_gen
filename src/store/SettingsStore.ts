import { makeAutoObservable, observable } from "mobx";
import { RootStore } from "./RootStore";

export class SettingsStore {
    @observable width: number = 600;
    @observable height: number = 1000;
    @observable borderWidth: number = 2;

    @observable backgroundColor: string = '#FFFFFF';
    @observable borderColor: string = '#000000';

    constructor(rootStore: RootStore) {
        makeAutoObservable(this);
    }
}