import React, { useMemo } from 'react';
import {
    ChoiceGroup,
    IChoiceGroupOption,
    Stack,
    useTheme
} from '@fluentui/react';
import CardboardMultiSelect from '../../../../../CardboardMultiSelect/CardboardMultiSelect';
import { IConditionSummaryProps } from './ConditionsCallout.types';
import BoundaryInput from './BoundaryInput';
import { Boundary } from '../../../../../ValueRangeBuilder/ValueRangeBuilder.types';
import { useTranslation } from 'react-i18next';
import { getSummaryStyles } from './ConditionsCallout.styles';

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    invalidRanges: `${ROOT_LOC}.invalidRanges`,
    choiceGroupTrue: `${ROOT_LOC}.choiceGroupTrue`,
    choiceGroupFalse: `${ROOT_LOC}.choiceGroupFalse`,
    conditionsTitle: `${ROOT_LOC}.conditionsTitle`
};

export const ConditionSummary: React.FC<IConditionSummaryProps> = (props) => {
    const {
        areValuesValid,
        conditionType,
        onChangeValues,
        currentValues
    } = props;

    // Hooks
    const { t } = useTranslation();

    const getChoiceGroupOptions: IChoiceGroupOption[] = useMemo(
        () => [
            {
                key: 'true',
                text: `${t(LOC_KEYS.choiceGroupTrue)}`
            },
            {
                key: 'false',
                text: `${t(LOC_KEYS.choiceGroupFalse)}`
            }
        ],
        [t]
    );

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

    const styles = getSummaryStyles(useTheme());

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
                {!areValuesValid && (
                    <div className={styles.invalidText}>
                        {t(LOC_KEYS.invalidRanges)}
                    </div>
                )}
            </Stack>
        );
    };

    const renderBooleanSummary = () => {
        return (
            <ChoiceGroup
                selectedKey={String(currentValues[0])}
                options={getChoiceGroupOptions}
                onChange={(_ev, option) => {
                    // Comparison turns value into correct boolean
                    onChangeValues(conditionType, [option.key === 'true']);
                }}
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
                <p>{t(LOC_KEYS.conditionsTitle)}</p>
                {renderFields()}
            </Stack>
        </>
    );
};
