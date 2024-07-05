import { observer } from "mobx-react-lite";
import { useStore } from "../store/store";
import { ColorField } from "./ColorField";
import { TextEditField } from "./TextEditField";

export const ForegroundSettingsSection = observer(() => {
    const store = useStore();

    return (<div>
        <TextEditField
            label='Margin'
            type='number'
            value={store.settingsStore.foregroundMargin.toString()}
            onValueChange={(value) => { store.settingsStore.foregroundMargin = parseInt(value) }}
        />
        <ColorField
            label='Color'
            value={store.settingsStore.foregroundColor}
            onValueChange={(value) => { store.settingsStore.foregroundColor = value }}
        />
        <TextEditField
            label='Border width'
            type='number'
            value={store.settingsStore.foregroundBorderWidth.toString()}
            onValueChange={(value) => { store.settingsStore.foregroundBorderWidth = parseInt(value) }}
        />
        <ColorField
            label='Border Color'
            value={store.settingsStore.foregroundBorderColor}
            onValueChange={(value) => { store.settingsStore.foregroundBorderColor = value }}
        />
    </div>)
});