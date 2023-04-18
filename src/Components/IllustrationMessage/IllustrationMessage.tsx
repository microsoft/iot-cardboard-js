import React, { useMemo } from 'react';
import {
    classNamesFunction,
    Image,
    Text,
    useTheme,
    styled,
    Link,
    PrimaryButton,
    Stack,
    DefaultButton
} from '@fluentui/react';
import {
    IllustrationMessageStyles,
    IllustrationMessageProps,
    IllustrationMessageStyleProps
} from './IllustrationMessage.types';
import { getIllustrationMessageStyles } from './IllustrationMessage.styles';

const getClassNames = classNamesFunction<
    IllustrationMessageStyleProps,
    IllustrationMessageStyles
>();

const IllustrationMessage: React.FunctionComponent<IllustrationMessageProps> = (
    props: IllustrationMessageProps
) => {
    const {
        imageProps,
        linkProps,
        primaryButtonProps,
        defaultButtonProps,
        headerText,
        descriptionText,
        linkText,
        type,
        width,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        type: type,
        width: width,
        theme: useTheme()
    });
    const getFullDescription = useMemo(() => {
        if (!linkProps) {
            return (
                <div className={classNames.descriptionContainer}>
                    <Text styles={classNames.subComponentStyles.description}>
                        {descriptionText}
                    </Text>
                </div>
            );
        } else {
            return (
                <div className={classNames.descriptionContainer}>
                    <Text styles={classNames.subComponentStyles.description}>
                        {descriptionText}{' '}
                        <Link
                            styles={classNames.subComponentStyles.link}
                            {...linkProps}
                        >
                            {linkText}
                        </Link>
                    </Text>
                </div>
            );
        }
    }, [linkProps, descriptionText, linkText]);

    return (
        <div className={classNames.container}>
            {imageProps ? (
                <Image
                    styles={classNames.subComponentStyles.image}
                    {...imageProps}
                />
            ) : null}
            {headerText && (
                <Text styles={classNames.subComponentStyles.header}>
                    {headerText}
                </Text>
            )}
            {getFullDescription}
            <Stack horizontal tokens={{ childrenGap: 8 }}>
                {primaryButtonProps ? (
                    <PrimaryButton {...primaryButtonProps} />
                ) : null}
                {defaultButtonProps ? (
                    <DefaultButton {...defaultButtonProps} />
                ) : null}
            </Stack>
        </div>
    );
};

export default styled<
    IllustrationMessageProps,
    IllustrationMessageStyleProps,
    IllustrationMessageStyles
>(IllustrationMessage, getIllustrationMessageStyles);
