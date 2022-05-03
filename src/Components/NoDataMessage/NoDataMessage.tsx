import React from 'react';
import {
    classNamesFunction,
    Image,
    Text,
    useTheme,
    Theme,
    styled
} from '@fluentui/react';
import { NoDataMessageStyles, NoDataMessageProps } from './NoDataMessage.types';
import { getNoDataMessageStyles } from './NoDataMessage.styles';

const getClassNames = classNamesFunction<
    { theme: Theme },
    NoDataMessageStyles
>();

const NoDataMessage: React.FunctionComponent<NoDataMessageProps> = (
    props: NoDataMessageProps
) => {
    const { imageProps, headerText, descriptionText, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.container}>
            {imageProps ? (
                <Image
                    styles={classNames.subComponentStyles.image}
                    {...imageProps}
                />
            ) : null}
            <Text styles={classNames.subComponentStyles.header}>
                {headerText}
            </Text>
            {descriptionText ? (
                <Text styles={classNames.subComponentStyles.description}>
                    {descriptionText}
                </Text>
            ) : null}
        </div>
    );
};

export default styled<NoDataMessageProps, null, NoDataMessageStyles>(
    NoDataMessage,
    getNoDataMessageStyles
);
