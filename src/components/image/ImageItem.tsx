import { Trash } from "@phosphor-icons/react";
import { Button, usePrismaneColor } from "@prismane/core";

interface IProps {
    selected: boolean;
    onClick: () => void;
    onRemoveClick: () => void;
    url: string;
}

export const ImageItem = (props: IProps) => {
    const { getColor } = usePrismaneColor();

    return (
        <div style={{ width: '200px', height: '200px', position: 'relative' }}>
            <img style={{ width: '100%', height: '100%', border: props.selected ? '2px solid white' : '' }} src={props.url} onClick={props.onClick} />
            <Button style={{ position: 'absolute', top: '10px', right: '10px' }} size="xs" bg={getColor('red', 600)} icon={<Trash />} onClick={() => props.onRemoveClick()} />
        </div>
    )
}