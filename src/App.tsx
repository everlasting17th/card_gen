import './App.css';
import { Box, Grid, PRISMANE_COLORS, PrismaneProvider, fr, usePrismaneColor } from '@prismane/core';
import { SettingsTab } from './components/SettingsTab';
import { StoreContext } from './store/store';
import { store } from './store/RootStore';
import { CardCanvas } from './components/CardCanvas';
import { Split } from '@geoffcox/react-splitter';

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

    const colors = {
        color: getColor('copper', 900),
        hover: getColor('copper', 600),
        drag: getColor('copper', 300)
    };

    return (
        <StoreContext.Provider value={store}>
            <PrismaneProvider theme={theme}>
                <Split defaultSplitterColors={colors} minSecondarySize='900px'>
                    <Box bg='base' >
                        <CardCanvas />
                    </Box>
                    <Box h='100%' bg={getColor('sepia', 900)} style={{ overflowY: 'auto' }}>
                        <SettingsTab />
                    </Box>
                </Split>
            </PrismaneProvider>
        </StoreContext.Provider>
    );
}

export default App;
