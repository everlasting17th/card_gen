import { SketchPicker } from 'react-color';
import './ColorField.scss'
import { Box, Text, usePrismaneColor } from "@prismane/core";
import { useState } from 'react';
import { useOutsideClick } from '../hooks/useOutsideClick';

interface IProps {
    label: string;
    value: string;
    onValueChange?: (value: string) => void;
}

export const ColorField = (props: IProps) => {
    const { getColor } = usePrismaneColor();

    const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);

    const changeColor = (color: string) => {
        if (props.onValueChange) {
            props.onValueChange(color);
        }
    }

    const ref = useOutsideClick(() => { setDisplayColorPicker(false) })

    return (
        <div className="color-field">
            <div className="color-field__label">
                <Text as='p' cl={getColor('coal', 400)}>{props.label}</Text>
            </div>
            <div className="color-field__value">
                <Box h='24px' w='100px' bg={props.value} bd='1px solid white' onClick={() => setDisplayColorPicker(!displayColorPicker)}></Box>
                {displayColorPicker ?
                    (<div ref={ref} style={{ position: 'absolute' }} onBlur={() => setDisplayColorPicker(false)}>
                        <SketchPicker color={props.value} onChange={c => changeColor(c.hex)} />
                    </div>) : null
                }
            </div>
            <Text as='p' cl='white' ml='10px'>{props.value}</Text>
        </div>
    );
}