import { SettingsStore } from "./SettingsStore";

export class RootStore {
    settingsStore: SettingsStore;

    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}

export const store = new RootStore();