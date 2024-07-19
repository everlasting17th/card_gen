import { Flex, Box, usePrismaneColor } from "@prismane/core"

export const PresetsTab = () => {

    const { getColor } = usePrismaneColor();

    return (
        <Flex mih='900px'>
            <Box bg={getColor('sepia', 900)} mih='600px' h='100%' w='250px'>

            </Box>
        </Flex >
    )
}