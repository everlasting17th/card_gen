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
            value={store.settingsStore.data.foreground.margin.toString()}
            onValueChange={(value) => { store.settingsStore.data.foreground.margin = parseInt(value) }}
        />
        <ColorField
            label='Color'
            value={store.settingsStore.data.foreground.color}
            onValueChange={(value) => { store.settingsStore.data.foreground.color = value }}
        />
        <TextEditField
            label='Border width'
            type='number'
            value={store.settingsStore.data.foreground.borderWidth.toString()}
            onValueChange={(value) => { store.settingsStore.data.foreground.borderWidth = parseInt(value) }}
        />
        <ColorField
            label='Border Color'
            value={store.settingsStore.data.foreground.borderColor}
            onValueChange={(value) => { store.settingsStore.data.foreground.borderColor = value }}
        />
    </div>)
});