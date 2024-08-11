import { Main, Text, Container, Divider, Center, Flex, Button, usePrismaneColor, Toaster } from "@prismane/core";
import { Section } from "./common/Section";
import { BackgroundSettingsSection } from "./BackgroundSettingsSection";
import { ForegroundSettingsSection } from "./ForegroundSettingsSection";
import { ContentSettingsSection } from "./ContentSettingsSection";
import { ImageSettingsSection } from "./image/ImageSettingsSection";
import { useCopySettings } from "../hooks/useCopySettings";
import React from "react";

export const SettingsTab = () => {

    const pjson = require('./../../package.json');

    const { getColor } = usePrismaneColor();
    const { copy, paste } = useCopySettings();

    return (
        <Main style={{ position: 'relative' }}>
            <Container maxSize='xxl'>
                <Flex style={{ width: '100%' }}>
                    <Text fs='xl' cl='copper' fw='bold'>Card Generator v{pjson.version}</Text>
                    <Flex align="end" gap={2} direction="column" style={{ marginLeft: 'auto' }} w='200px'>
                        <Toaster>
                            <Button h='20px' w='100%' bg={getColor('green', 800)} onClick={() => copy()}>Copy settings</Button>
                        </Toaster>
                        <Button h='20px' w='100%' bg={getColor('copper', 800)} onClick={async () => await paste()}>Paste settings</Button>
                    </Flex>
                </Flex>
                <Center h='20px' w='100%'>
                    <Divider />
                </Center>
                <Section name='Background' content={<BackgroundSettingsSection />} />
                <Section name='Foreground' content={<ForegroundSettingsSection />} />
                <Section name='Content' content={<ContentSettingsSection />} />
                <Section name='Image' content={<ImageSettingsSection />} minHeight={400} />
            </Container>
        </Main>
    )
} 