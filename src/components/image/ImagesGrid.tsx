import { Flex } from "@prismane/core";
import { ImageItem } from "./ImageItem";
import { ImageThumbnail } from "./ImageThumbnail";
import { useReadyImages } from "@/hooks/useReadyImages";
import { useAwaitedPrompts } from "@/hooks/useAwaitedPrompts";
import { observer } from "mobx-react-lite";

export const ImagesGrid = observer(() => {
    const { setSelectedImage, getReadyImages, removeImage, isImageSelected } = useReadyImages();
    const { getAwaitedPrompts } = useAwaitedPrompts();

    return (
        <Flex gap='15px' wrap="wrap">
            {
                getReadyImages().map((url, i) => {
                    return (
                        <ImageItem
                            key={i}
                            selected={isImageSelected(i)}
                            url={url}
                            onClick={() => { setSelectedImage(i) }}
                            onRemoveClick={() => { removeImage(i) }}
                        />
                    )
                })
            }
            {
                Array(getAwaitedPrompts().length).fill(0).map((k: number, i: number) => {
                    return (
                        <ImageThumbnail key={i} />
                    )
                })
            }
        </Flex>
    );
});