import { Callout, IColorCellProps, SwatchColorPicker } from '@fluentui/react';
import React from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { useTranslation } from 'react-i18next';
import './ColorSelectButton.scss';

interface ColorSelectButtonProps {
    buttonColor: string;
    colorSwatch: IColorCellProps[];
    onChangeSwatchColor: (color: string) => void;
}

const ColorSelectButton: React.FC<ColorSelectButtonProps> = ({
    buttonColor,
    colorSwatch,
    onChangeSwatchColor
}) => {
    const labelId = useId('callout-label');
    const colorButtonId = useId('color-button');

    const [
        isRowColorCalloutVisible,
        { toggle: toggleIsRowColorCalloutVisible }
    ] = useBoolean(false);

    const { t } = useTranslation();

    return (
        // root node is needed to prevent bouncing when callout opens
        <div className={'cb-color-select-root'}>
            <button
                aria-label={t('valueRangeBuilder.colorButtonAriaLabel')}
                data-testid={'range-builder-row-color-picker'}
                style={{ backgroundColor: buttonColor }}
                className="cb-color-select-button"
                onClick={toggleIsRowColorCalloutVisible}
                id={colorButtonId}
            />
            {isRowColorCalloutVisible && (
                <Callout
                    ariaLabelledBy={labelId}
                    target={`#${colorButtonId}`}
                    onDismiss={toggleIsRowColorCalloutVisible}
                    setInitialFocus
                    styles={{ root: { width: 100 } }}
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

export default ColorSelectButton;
