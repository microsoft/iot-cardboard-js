import {
    Callout,
    classNamesFunction,
    ICalloutContentStyleProps,
    ICalloutContentStyles,
    IColorCellProps,
    IStyleFunctionOrObject,
    styled,
    SwatchColorPicker
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
    onChangeSwatchColor,
    styles,
    theme
}) => {
    const { t } = useTranslation();
    const classNames = getClassNames(styles!, {
        theme: theme!
    });
    const calloutStyles = classNames.subComponentStyles
        ? (classNames.subComponentStyles.callout as IStyleFunctionOrObject<
              ICalloutContentStyleProps,
              ICalloutContentStyles
          >)
        : undefined;
    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    return (
        // root node is needed to prevent bouncing when callout opens
        <div className={classNames.root}>
            <button
                aria-label={t('valueRangeBuilder.colorButtonAriaLabel')}
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
                    styles={calloutStyles}
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
