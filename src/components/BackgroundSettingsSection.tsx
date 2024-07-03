import { SketchPicker } from 'react-color';
import { ColorField } from './ColorField';
import { useStore } from '../store/store';
import { observer } from 'mobx-react-lite';
import { TextEditField } from './TextEditField';

export const BackgroundSettingsSection = observer(() => {
    const store = useStore();

    return (
        <div>
            <TextEditField
                label='Width'
                type='number'
                value={store.settingsStore.width.toString()}
                onValueChange={(value) => { store.settingsStore.width = parseInt(value) }}
            />
            <TextEditField
                label='Height'
                type='number'
                value={store.settingsStore.height.toString()}
                onValueChange={(value) => { store.settingsStore.height = parseInt(value) }}
            />
            <ColorField
                label='Color'
                value={store.settingsStore.backgroundColor}
                onValueChange={(value) => { store.settingsStore.backgroundColor = value }}
            />
            <ColorField
                label='Border'
                value={store.settingsStore.borderColor}
                onValueChange={(value) => store.settingsStore.borderColor = value}
            />
            <TextEditField
                label='Border Width'
                type='number'
                value={store.settingsStore.borderWidth.toString()}
                onValueChange={(value) => { store.settingsStore.borderWidth = parseInt(value) }}
            />
        </div>
    );
});