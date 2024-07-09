import './TextEditField.scss'
import { TextField, Text, usePrismaneColor } from "@prismane/core"

interface IProps {
    label?: string;
    value: string;
    type: string;
    onValueChange?: (value: string) => void;
}

export const TextEditField = (props: IProps) => {

    const { getColor } = usePrismaneColor();

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
                <TextField h='24px' type={props.type} value={props.value} onChange={(ev) => {
                    if (props.onValueChange) {
                        props.onValueChange(ev.target.value)
                    }
                }} />
            </div>
        </div>
    )
}