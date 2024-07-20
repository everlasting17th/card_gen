import { TextField } from "@prismane/core";
import { createRef, useEffect } from "react";

interface IProps {
    value: string;
    onValueChange: (value: string) => void;
    type: string;
    step?: number;
    min?: number;
    max?: number;
}

export const TextFieldCompact = (props: IProps) => {
    const textField = createRef<HTMLInputElement>();

    useEffect(() => {
        textField.current!.step = props.step?.toString() ?? '';
        textField.current!.min = props.min?.toString() ?? '';
        textField.current!.max = props.max?.toString() ?? '';
    }, [textField]);

    return (
        <TextField
            ref={textField}
            h='25px'
            size='xs'
            w='100px'
            type={props.type}
            value={props.value}
            onChange={(e) => props.onValueChange(e.target.value)}
        />
    );
}