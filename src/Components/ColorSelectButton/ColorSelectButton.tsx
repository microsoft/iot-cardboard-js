import {
    Callout,
    classNamesFunction,
    Label,
    styled,
    SwatchColorPicker,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import { getStyles } from './ColorSelectButton.styles';
import {
    IColorSelectButtonProps,
    IColorSelectButtonStyleProps,
    IColorSelectButtonStyles
} from './ColorSelectButton.types';

const getClassNames = classNamesFunction<
    IColorSelectButtonStyleProps,
    IColorSelectButtonStyles
>();

const ColorSelectButton: React.FC<IColorSelectButtonProps> = ({
    buttonColor,
    colorSwatch,
    label,
    onChangeSwatchColor,
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
            <button
                aria-label={
                    label || t('valueRangeBuilder.colorButtonAriaLabel')
                }
                data-testid={'range-builder-row-color-picker'}
                style={{ backgroundColor: buttonColor }}
                className={classNames.button}
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            />
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
                        colorCells={colorSwatch}
                        aria-labelledby={labelId}
                        onChange={(_e, _id, color) =>
                            onChangeSwatchColor(color)
                        }
                        selectedId={
                            colorSwatch.find(
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
    IColorSelectButtonProps,
    IColorSelectButtonStyleProps,
    IColorSelectButtonStyles
>(ColorSelectButton, getStyles);
