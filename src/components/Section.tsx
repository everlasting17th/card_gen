import { ArrowDown, ArrowUp } from '@phosphor-icons/react';
import './Section.scss'
import { ActionButton, Center, Collapse, Divider, Hide, Text } from "@prismane/core";
import React, { useState } from 'react';

interface IProps {
    name: string;
    content: React.ReactNode;
}

export const Section = (props: IProps) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div style={{ width: '100%' }}>
            <div className='section'>
                <div className='section__header'>
                    <Text as='p' >{props.name}</Text>

                </div>
                <div className='section__middle'></div>
                <div className='section__button'>
                    <ActionButton size='xs' icon={isExpanded ? <ArrowUp /> : <ArrowDown />} onClick={() => setIsExpanded(!isExpanded)} />
                </div>
            </div>
            {isExpanded ? null : (<Center w='100%' h='20px'>
                <Divider variant='dotted' />
            </Center>)}
            <Collapse h='auto' open={isExpanded}>
                {props.content}
                <Center w='100%' h='20px'>
                    <Divider variant='dotted' />
                </Center>
            </Collapse>
        </div>
    );
}