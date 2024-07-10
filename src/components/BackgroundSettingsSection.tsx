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
                value={store.settingsStore.data.background.width.toString()}
                onValueChange={(value) => { store.settingsStore.data.background.width = parseInt(value) }}
            />
            <TextEditField
                label='Height'
                type='number'
                value={store.settingsStore.data.background.height.toString()}
                onValueChange={(value) => { store.settingsStore.data.background.height = parseInt(value) }}
            />
            <ColorField
                label='Color'
                value={store.settingsStore.data.background.color}
                onValueChange={(value) => { store.settingsStore.data.background.color = value }}
            />
            <ColorField
                label='Accent color'
                value={store.settingsStore.data.background.accentColor}
                onValueChange={(value) => { store.settingsStore.data.background.accentColor = value }}
            />
            <ColorField
                label='Border'
                value={store.settingsStore.data.background.borderColor}
                onValueChange={(value) => store.settingsStore.data.background.borderColor = value}
            />
            <TextEditField
                label='Border Width'
                type='number'
                value={store.settingsStore.data.background.borderWidth.toString()}
                onValueChange={(value) => { store.settingsStore.data.background.borderWidth = parseInt(value) }}
            />
        </div>
    );
});