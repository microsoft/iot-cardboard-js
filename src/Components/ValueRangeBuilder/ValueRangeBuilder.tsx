import React, { createContext, useEffect } from 'react';
import BaseComponent from '../BaseComponent/BaseComponent';
import './ValueRangeBuilder.scss';
import { ActionButton } from '@fluentui/react';
import { createGUID } from '../../Models/Services/Utils';
import {
    IValueRangeBuilderContext,
    IValueRangeBuilderProps,
    ValueRangeBuilderActionType
} from './ValueRangeBuilder.types';
import {
    areDistinctValueRangesValid,
    getNextColor,
    isRangeOverlapFound
} from './ValueRangeBuilder.utils';
import { useTranslation } from 'react-i18next';
import ValueRangeValidationError from './Internal/ValueRangeValidationError';
import ValueRangeRow from './Internal/ValueRangeRow';

export const ValueRangeBuilderContext = createContext<IValueRangeBuilderContext>(
    null
);

const ValueRangeBuilder: React.FC<IValueRangeBuilderProps> = ({
    className,
    baseComponentProps,
    valueRangeBuilderReducer
}) => {
    const { t } = useTranslation();

    const { state, dispatch } = valueRangeBuilderReducer;

    const { validationMap } = state;

    // On mount, pre-fill value ranges to min required
    useEffect(() => {
        if (state.valueRanges.length < state.minRanges) {
            dispatch({
                type:
                    ValueRangeBuilderActionType.PRE_FILL_VALUE_RANGES_TO_MIN_REQUIRED
            });
        }
    }, []);

    // Update consumer when validation map changes
    useEffect(() => {
        const areDistinctRangesValid = areDistinctValueRangesValid(
            state.validationMap
        );
        const isOverlapDetected = isRangeOverlapFound(
            state.valueRanges,
            state.validationMap
        );

        const areRangesValid = areDistinctRangesValid && !isOverlapDetected;
        dispatch({
            type: ValueRangeBuilderActionType.SET_ARE_RANGES_VALID,
            payload: areRangesValid
        });
    }, [state.validationMap]);

    return (
        <ValueRangeBuilderContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <BaseComponent
                {...baseComponentProps}
                containerClassName={`cb-value-range-builder-container ${
                    className ? className : ''
                }`}
            >
                {state.valueRanges.map((valueRange) => (
                    <div
                        className="cb-value-range-and-messaging-row-container"
                        key={valueRange.id}
                    >
                        <ValueRangeRow valueRange={valueRange} />
                        <ValueRangeValidationError valueRange={valueRange} />
                    </div>
                ))}
                {areDistinctValueRangesValid(validationMap) &&
                    validationMap.overlapFound && (
                        <div className="cb-value-range-validation-error">
                            {t('valueRangeBuilder.overlapDetectedMessage')}
                        </div>
                    )}
                {!(
                    state.maxRanges &&
                    state.valueRanges.length >= state.maxRanges
                ) && (
                    <ActionButton
                        data-testid={'range-builder-add'}
                        iconProps={{ iconName: 'Add' }}
                        onClick={() => {
                            const id = createGUID();

                            dispatch({
                                type:
                                    ValueRangeBuilderActionType.ADD_VALUE_RANGE,
                                payload: {
                                    id,
                                    color: getNextColor(
                                        state.valueRanges,
                                        state.colorSwatch
                                    )
                                }
                            });
                        }}
                        ariaLabel={t(
                            'valueRangeBuilder.addValueRangeButtonText'
                        )}
                    >
                        {t('valueRangeBuilder.addValueRangeButtonText')}
                    </ActionButton>
                )}
            </BaseComponent>
        </ValueRangeBuilderContext.Provider>
    );
};

export default React.memo(ValueRangeBuilder);
