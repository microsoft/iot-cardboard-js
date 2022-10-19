import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useId } from '@fluentui/react-hooks';
import { ReactComponent as InfinitySvg } from '../../../../../../Resources/Static/infinity.svg';
import { getBoundaryInputStyles } from './ConditionsCallout.styles';
import { useTheme } from '@fluentui/react';

enum Boundary {
    min = 'min',
    max = 'max'
}

const BoundaryInput: React.FC<{
    value: string;
    boundary: Boundary;
    setNewValues: (value: string) => void;
    setValueToInfinity: (value: string) => void;
}> = ({ boundary, setNewValues, setValueToInfinity, value }) => {
    const guid = useId();
    const { t } = useTranslation();

    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const isMin = boundary === Boundary.min;
    const infinityIconMessage = isMin
        ? t('valueRangeBuilder.negativeInfinityIconMessage')
        : t('valueRangeBuilder.positiveInfinityIconMessage');
    const styles = getBoundaryInputStyles(useTheme());

    return (
        <>
            <div className={styles.container}>
                <label className={styles.label} htmlFor={guid}>
                    {isMin ? t('min') : t('max')}
                </label>
                <div className={styles.inputContainer}>
                    <input
                        autoComplete="false"
                        data-testid={
                            isMin
                                ? 'range-builder-row-input-min'
                                : 'range-builder-row-input-max'
                        }
                        id={guid}
                        value={String(inputValue)}
                        type="string"
                        onChange={(event) => setInputValue(event.target.value)}
                        className={styles.input}
                        onBlur={() => {
                            setNewValues(inputValue);
                        }}
                    />
                    <button
                        aria-label={infinityIconMessage}
                        className={`${
                            isMin
                                ? styles.negativeInfinityButton
                                : styles.infinityButton
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
                    </button>
                </div>
            </div>
        </>
    );
};

export default BoundaryInput;
