import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useId } from '@fluentui/react-hooks';
import { ReactComponent as InfinitySvg } from '../../../../../../Resources/Static/infinity.svg';
import {
    ActionButton,
    classNamesFunction,
    styled,
    useTheme
} from '@fluentui/react';
import {
    BoundaryType,
    IBoundaryInputProps,
    IBoundaryInputStyleProps,
    IBoundaryInputStyles
} from './BoundaryInput.types';
import { getStyles } from './BoundaryInput.styles';

const getClassNames = classNamesFunction<
    IBoundaryInputStyleProps,
    IBoundaryInputStyles
>();

const BoundaryInput: React.FC<IBoundaryInputProps> = (props) => {
    const { boundary, setNewValues, setValueToInfinity, value, styles } = props;
    const inputFieldId = useId();
    const { t } = useTranslation();

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const isMin = boundary === BoundaryType.min;
    const infinityIconMessage = isMin
        ? t('valueRangeBuilder.negativeInfinityIconMessage')
        : t('valueRangeBuilder.positiveInfinityIconMessage');

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <>
            <div className={classNames.container}>
                <label className={classNames.label} htmlFor={inputFieldId}>
                    {isMin ? t('min') : t('max')}
                </label>
                <div className={classNames.inputContainer}>
                    <input
                        autoComplete="false"
                        data-testid={
                            isMin
                                ? 'range-builder-row-input-min'
                                : 'range-builder-row-input-max'
                        }
                        id={inputFieldId}
                        value={String(inputValue)}
                        type="string"
                        onChange={(event) => setInputValue(event.target.value)}
                        className={classNames.input}
                        onBlur={() => {
                            setNewValues(inputValue);
                        }}
                    />
                    <ActionButton
                        aria-label={infinityIconMessage}
                        className={`${
                            isMin
                                ? classNames.negativeInfinityButton
                                : classNames.infinityButton
                        }`}
                        data-testid={
                            isMin
                                ? 'range-builder-row-infinite-min'
                                : 'range-builder-row-infinite-max'
                        }
                        title={infinityIconMessage}
                        onClick={() => {
                            setValueToInfinity(
                                isMin ? '-Infinity' : 'Infinity'
                            );
                        }}
                    >
                        <InfinitySvg />
                    </ActionButton>
                </div>
            </div>
        </>
    );
};

export default styled<
    IBoundaryInputProps,
    IBoundaryInputStyleProps,
    IBoundaryInputStyles
>(BoundaryInput, getStyles);
