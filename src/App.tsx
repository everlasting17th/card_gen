import './App.css';
import { Grid, PRISMANE_COLORS, PrismaneProvider, fr, usePrismaneColor } from '@prismane/core';
import { SettingsTab } from './components/SettingsTab';
import { StoreContext } from './store/store';
import { store } from './store/RootStore';
import { CardCanvas } from './components/CardCanvas';

function App() {
    const theme = {
        mode: 'dark',
        colors: {
            primary: { ...PRISMANE_COLORS.copper },
            base: { ...PRISMANE_COLORS.sepia }
        },
        spacing: '5px'
    }

    const { getColor } = usePrismaneColor();


    return (
        <StoreContext.Provider value={store}>
            <PrismaneProvider theme={theme}>
                <Grid templateColumns={8} gap={fr(1)} w='100%' h='100%'>
                    <Grid.Item bg='base' columnStart={1} columnEnd={6}>
                        <CardCanvas />
                    </Grid.Item>
                    <Grid.Item bg={getColor('sepia', 900)} style={{ overflowY: 'auto' }} columnStart={6} columnEnd={9}>
                        <SettingsTab />
                    </Grid.Item>
                </Grid>
            </PrismaneProvider>
        </StoreContext.Provider>
    );
}

export default App;
