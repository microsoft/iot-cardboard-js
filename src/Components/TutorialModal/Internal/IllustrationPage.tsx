import React from 'react';
import { Image, IProcessedStyleSet, Text, Stack } from '@fluentui/react';
import { ITutorialModalStyles } from '../TutorialModal.types';

const IllustrationPage: React.FC<{
    svgSrc: string;
    title: string;
    text: string;
    classNames: IProcessedStyleSet<ITutorialModalStyles>;
}> = ({ svgSrc, title, text, classNames }) => {
    return (
        <div className={classNames.illustrationPageContainer}>
            <Stack tokens={{ childrenGap: 20 }}>
                <Stack.Item align="center">
                    <Image
                        src={svgSrc}
                        shouldStartVisible={true}
                        height={150}
                    />
                </Stack.Item>
                <Stack.Item align="center">
                    <Text>{title}</Text>
                </Stack.Item>
                <Stack.Item align="center">
                    <Text>{text}</Text>
                </Stack.Item>
            </Stack>
        </div>
    );
};

export default IllustrationPage;
