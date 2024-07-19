import { useStore } from "../store/store";

export const useReadyImages = () => {
    const store = useStore();

    const getSelectedImage = () => store.settingsStore.data.image.selectedImage;
    const setSelectedImage = (index: number | null) => store.settingsStore.data.image.selectedImage = index;

    return {
        getReadyImages: () => store.settingsStore.data.operational.readyImages,
        getSelectedImage: getSelectedImage,
        setSelectedImage: setSelectedImage,
        isImageSelected: (index: number): boolean => store.settingsStore.data.image.selectedImage == index,
        addImage: (url: string) => {
            store.settingsStore.data.operational.readyImages.push(url)
        },
        removeImage: (index: number) => {
            const selectedImage = getSelectedImage();

            if (selectedImage != null) {
                if (index < selectedImage) {
                    setSelectedImage(selectedImage - 1);
                } else if (index == selectedImage) {
                    setSelectedImage(null);
                }
            }

            store.settingsStore.data.operational.readyImages.splice(index, 1);
        },
    };
};