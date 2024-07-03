import { Main, Text, Container, Divider, Center } from "@prismane/core";
import { Section } from "./Section";
import { BackgroundSettingsSection } from "./BackgroundSettingsSection";

export const SettingsTab = () => {
    return (
        <Main>
            <Container maxSize="xl">
                <Text fs='xl' cl='copper' fw='bold'>Card Generator v0.1</Text>
                <Center h='20px' w='100%'>
                    <Divider />
                </Center>
                <Section name='Background' content={<BackgroundSettingsSection />} />
            </Container>
        </Main>
    )
} 