import './TextareaEditField.scss';
import { usePrismaneColor, Text, TextareaField } from "@prismane/core";

interface IProps {
    label?: string;
    value: string;
    placeholder?: string;
    height: number;
    onValueChange?: (value: string) => void;
}

export const TextareEditField = (props: IProps) => {
    const { getColor } = usePrismaneColor();

    return (
        <div className='textarea-field'>
            {
                props.label != undefined
                    ? (
                        <div className="textarea-field__label">
                            <Text as='p' cl={getColor('coal', 400)}>{props.label}</Text>
                        </div>
                    )
                    : (<div />)
            }
            <div className="textarea-field__input">
                <TextareaField
                    h={props.height.toString() + 'px'}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChange={(ev) => {
                        if (props.onValueChange) {
                            props.onValueChange(ev.target.value)
                        }
                    }}
                />
            </div>
        </div>
    )
}