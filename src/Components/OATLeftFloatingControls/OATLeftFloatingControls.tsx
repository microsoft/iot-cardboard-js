import React from 'react';
import {
    IOATLeftFloatingControlsProps,
    IOATLeftFloatingControlsStyleProps,
    IOATLeftFloatingControlsStyles
} from './OATLeftFloatingControls.types';
import { getStyles } from './OATLeftFloatingControls.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    DefaultButton,
    Callout,
    DirectionalHint,
    IIconProps
} from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import OATModelList from '../OATModelList/OATModelList';

const getClassNames = classNamesFunction<
    IOATLeftFloatingControlsStyleProps,
    IOATLeftFloatingControlsStyles
>();

const buttonIconProps: IIconProps = {
    iconName: 'Search'
};

const OATLeftFloatingControls: React.FC<IOATLeftFloatingControlsProps> = (
    props
) => {
    const { styles } = props;

    // contexts

    // state
    const [
        isModelListVisible,
        { toggle: toggleIsModelListVisible }
    ] = useBoolean(false);

    // hooks
    const { t } = useTranslation();
    const buttonId = useId('floatin-controls');

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <DefaultButton
                ariaLabel={
                    isModelListVisible
                        ? t('OATModelList.modelListToggleAriaLabelHide')
                        : t('OATModelList.modelListToggleAriaLabelShow')
                }
                checked={isModelListVisible}
                iconProps={buttonIconProps}
                id={buttonId}
                onClick={toggleIsModelListVisible}
                styles={classNames.subComponentStyles.modelsListButton()}
                toggle
            />
            {isModelListVisible && (
                <Callout
                    target={`#${buttonId}`}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                    styles={classNames.subComponentStyles.modelsListCallout}
                >
                    <OATModelList />
                </Callout>
            )}
        </div>
    );
};

export default styled<
    IOATLeftFloatingControlsProps,
    IOATLeftFloatingControlsStyleProps,
    IOATLeftFloatingControlsStyles
>(OATLeftFloatingControls, getStyles);
