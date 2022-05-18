import React from 'react';
import {
    Image,
    IProcessedStyleSet,
    Text,
    Stack,
    IStackItemStyles,
    ITextStyles,
    FontSizes,
    FontWeights,
    IStackStyles
} from '@fluentui/react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const IllustrationPage: React.FC<{
    svgSrc: string;
    title: string;
    text: string;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ svgSrc, title, text }) => {
    return (
        <Stack tokens={{ childrenGap: 16 }} styles={stackStyles}>
            <Stack.Item align="center">
                <Image src={svgSrc} height={172} />
            </Stack.Item>
            <Stack.Item align="center" styles={textContainerStackStyles}>
                <Text styles={titleStyles}>{title}</Text>
            </Stack.Item>
            <Stack.Item align="center" styles={textContainerStackStyles}>
                <Text styles={descriptionStyles}>{text}</Text>
            </Stack.Item>
        </Stack>
    );
};

const stackStyles: Partial<IStackStyles> = {
    root: {
        padding: '0 80px',
        flexGrow: 1
    }
};

const textContainerStackStyles: Partial<IStackItemStyles> = {
    root: { textAlign: 'center' }
};

const titleStyles: Partial<ITextStyles> = {
    root: {
        fontSize: FontSizes.size18,
        fontWeight: FontWeights.semibold
    }
};

const descriptionStyles: Partial<ITextStyles> = {
    root: {
        fontSize: FontSizes.size14,
        fontWeight: FontWeights.regular
    }
};

export default IllustrationPage;
