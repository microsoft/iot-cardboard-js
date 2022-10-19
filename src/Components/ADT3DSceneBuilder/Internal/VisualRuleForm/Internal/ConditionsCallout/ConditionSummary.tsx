import React from 'react';
import { ChoiceGroup, IChoiceGroupOption, Stack } from '@fluentui/react';
import CardboardMultiSelect from '../../../../../CardboardMultiSelect/CardboardMultiSelect';
import { IConditionSummaryProps } from './ConditionsCallout.types';
import BoundaryInput from './BoundaryInput';
import { Boundary } from '../../../../../ValueRangeBuilder/ValueRangeBuilder.types';

const choiceGroupOptions: IChoiceGroupOption[] = [
    {
        key: 'true',
        text: 'true' // TODO LOC THIS
    },
    {
        key: 'false',
        text: 'false' // TODO LOC THIS
    }
];

export const ConditionSummary: React.FC<IConditionSummaryProps> = (props) => {
    const {
        areValuesValid,
        conditionType,
        onChangeValues,
        currentValues
    } = props;

    // Render callbacks
    const renderFields = () => {
        switch (conditionType) {
            case 'boolean':
                return renderBooleanSummary();
            case 'string':
                return renderStringSummary();
            default:
                return renderNumericalSummary();
        }
    };

    const renderNumericalSummary = () => {
        return (
            <Stack>
                <Stack horizontal={true} tokens={{ childrenGap: 8 }}>
                    <BoundaryInput
                        value={currentValues[0] as string}
                        boundary={Boundary.min}
                        setNewValues={(value: string) => {
                            onChangeValues(conditionType, [Number(value)], 0);
                        }}
                        setValueToInfinity={(value: string) => {
                            onChangeValues(conditionType, [value], 0);
                        }}
                    />
                    <BoundaryInput
                        value={currentValues[1] as string}
                        boundary={Boundary.max}
                        setNewValues={(value: string) => {
                            onChangeValues(conditionType, [Number(value)], 1);
                        }}
                        setValueToInfinity={(value: string) => {
                            onChangeValues(conditionType, [value], 1);
                        }}
                    />
                </Stack>
                {/* TODO: LOC THIS */}
                {!areValuesValid && <p>'Ranges invalid'</p>}
            </Stack>
        );
    };

    const renderBooleanSummary = () => {
        return (
            <ChoiceGroup
                defaultSelectedKey={
                    currentValues.length ? (currentValues[0] as string) : 'true'
                }
                options={choiceGroupOptions}
                styles={{
                    flexContainer: {
                        display: 'flex',
                        '.ms-ChoiceField': {
                            paddingRight: 12
                        }
                    }
                }}
            />
        );
    };

    const renderStringSummary = () => {
        return (
            <CardboardMultiSelect
                currentValues={currentValues}
                onChangeValues={onChangeValues}
            />
        );
    };

    return (
        <>
            <Stack>
                {/* TODO: LOC THIS */}
                <p>Conditions</p>
                {renderFields()}
            </Stack>
        </>
    );
};
