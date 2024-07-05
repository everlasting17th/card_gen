import { Main, Text, Container, Divider, Center } from "@prismane/core";
import { Section } from "./Section";
import { BackgroundSettingsSection } from "./BackgroundSettingsSection";
import { ForegroundSettingsSection } from "./ForegroundSettingsSection";

export const SettingsTab = () => {

    const pjson = require('./../../package.json');

    return (
        <Main>
            <Container maxSize="xl">
                <Text fs='xl' cl='copper' fw='bold'>Card Generator v{pjson.version}</Text>
                <Center h='20px' w='100%'>
                    <Divider />
                </Center>
                <Section name='Background' content={<BackgroundSettingsSection />} />
                <Section name='Foreground' content={<ForegroundSettingsSection />} />
            </Container>
        </Main>
    )
} 