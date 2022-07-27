import {
    classNamesFunction,
    PrimaryButton,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { getPrimaryContentStyles } from '../SceneLayers.styles';
import {
    IPrimaryActionCalloutContentsStyleProps,
    IPrimaryActionCalloutContentsStyles,
    IPrimaryActionCalloutContentsProps
} from '../SceneLayers.types';

const getClassNames = classNamesFunction<
    IPrimaryActionCalloutContentsStyleProps,
    IPrimaryActionCalloutContentsStyles
>();

const PrimaryActionCalloutContents: React.FC<IPrimaryActionCalloutContentsProps> = (
    props
) => {
    const {
        children,
        disablePrimaryButton = false,
        onPrimaryButtonClick,
        primaryButtonText,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.container}>
            <div className={classNames.body}>{children}</div>
            <div className={classNames.footer}>
                <PrimaryButton
                    onClick={onPrimaryButtonClick}
                    disabled={disablePrimaryButton}
                >
                    {primaryButtonText}
                </PrimaryButton>
            </div>
        </div>
    );
};

export default styled<
    IPrimaryActionCalloutContentsProps,
    IPrimaryActionCalloutContentsStyleProps,
    IPrimaryActionCalloutContentsStyles
>(PrimaryActionCalloutContents, getPrimaryContentStyles);
