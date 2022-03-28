import {
    Callout,
    classNamesFunction,
    IconButton,
    Label,
    styled,
    SwatchColorPicker,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { getStyles } from './IconSelectButton.styles';
import {
    IIconSelectButtonProps,
    IIconSelectButtonStyleProps,
    IIconSelectButtonStyles
} from './IconSelectButton.types';

const getClassNames = classNamesFunction<
    IIconSelectButtonStyleProps,
    IIconSelectButtonStyles
>();

const IconSelectButton: React.FC<IIconSelectButtonProps> = ({
    buttonColor,
    iconOptions,
    label,
    onChangeIcon,
    styles
}) => {
    const { t } = useTranslation();
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    return (
        // root node is needed to prevent bouncing when callout opens
        <div className={classNames.root}>
            {label && <Label>{label}</Label>}
            <IconButton
                iconProps={{ iconName: buttonColor }}
                ariaLabel={label || t('valueRangeBuilder.colorButtonAriaLabel')}
                data-testid={'range-builder-row-color-picker'}
                // style={{
                //     backgroundColor:
                //         theme.semanticColors.primaryButtonBackground
                // }}
                className={classNames.button}
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            />
            {/* <button
                aria-label={
                    label || t('valueRangeBuilder.colorButtonAriaLabel')
                }
                data-testid={'range-builder-row-color-picker'}
                style={{
                    backgroundColor:
                        theme.semanticColors.primaryButtonBackground
                }}
                className={classNames.button}
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            /> */}
            {isRowColorCalloutVisible && (
                <Callout
                    ariaLabelledBy={labelId}
                    target={`#${colorButtonId}`}
                    onDismiss={toggleIsRowColorCalloutVisible}
                    setInitialFocus
                    styles={classNames.subComponentStyles.callout}
                >
                    <SwatchColorPicker
                        columnCount={3}
                        cellShape={'circle'}
                        colorCells={iconOptions}
                        onRenderColorCell={(props) => {
                            return (
                                <IconButton
                                    iconProps={{ iconName: props.color }}
                                    onClick={(_e) => onChangeIcon(props.color)}
                                />
                            );
                        }}
                        aria-labelledby={labelId}
                        onChange={(_e, _id, item) => onChangeIcon(item)}
                        selectedId={
                            iconOptions.find(
                                (color) => color.color === buttonColor
                            )?.id
                        }
                    />
                </Callout>
            )}
        </div>
    );
};

export default styled<
    IIconSelectButtonProps,
    IIconSelectButtonStyleProps,
    IIconSelectButtonStyles
>(IconSelectButton, getStyles);
