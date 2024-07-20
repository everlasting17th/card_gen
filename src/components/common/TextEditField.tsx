import { createRef, useEffect } from 'react';
import './TextEditField.scss'
import { TextField, Text, usePrismaneColor } from "@prismane/core"

interface IProps {
    label?: string;
    value: string;
    type: string;
    step?: number;
    min?: number;
    max?: number;
    onValueChange?: (value: string) => void;
}

export const TextEditField = (props: IProps) => {

    const { getColor } = usePrismaneColor();

    const textField = createRef<HTMLInputElement>();

    useEffect(() => {
        textField.current!.step = props.step?.toString() ?? '';
        textField.current!.min = props.min?.toString() ?? '';
        textField.current!.max = props.max?.toString() ?? '';
    }, [textField]);

    return (
        <div className='text-field'>
            {
                props.label != undefined
                    ? (<div className="text-field__label">
                        <Text as='p' cl={getColor('coal', 400)}>{props.label}</Text>
                    </div>)
                    : <div />
            }

            <div className="text-field__input">
                <TextField
                    ref={textField}
                    h='24px'
                    type={props.type}
                    value={props.value}
                    onChange={(ev) => {
                        if (props.onValueChange) {
                            props.onValueChange(ev.target.value)
                        }
                    }} />
            </div>
        </div>
    )
}