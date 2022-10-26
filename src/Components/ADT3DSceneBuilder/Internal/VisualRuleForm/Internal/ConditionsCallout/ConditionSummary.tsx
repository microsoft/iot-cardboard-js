import React from 'react';
import {
    ChoiceGroup,
    classNamesFunction,
    IChoiceGroupOption,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import CardboardMultiSelect from '../../../../../CardboardMultiSelect/CardboardMultiSelect';
import BoundaryInput from './BoundaryInput';
import { useTranslation } from 'react-i18next';
import {
    IConditionSummaryStyleProps,
    IConditionSummaryStyles,
    IConditionSummaryProps
} from './ConditionSummary.types';
import { BoundaryType } from './BoundaryInput.types';
import { getStyles } from './ConditionSummary.styles';
import i18n from '../../../../../../i18n';

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    invalidRanges: `${ROOT_LOC}.invalidRanges`,
    choiceGroupTrue: `${ROOT_LOC}.choiceGroupTrue`,
    choiceGroupFalse: `${ROOT_LOC}.choiceGroupFalse`,
    flyoutValuesTitle: `${ROOT_LOC}.flyoutValuesTitle`,
    flyoutValueTitle: `${ROOT_LOC}.flyoutValueTitle`
};

const STACK_TOKENS = { childrenGap: 8 };

const getChoiceGroupOptions = (): IChoiceGroupOption[] => [
    {
        key: 'true',
        text: `${i18n.t(LOC_KEYS.choiceGroupTrue)}`
    },
    {
        key: 'false',
        text: `${i18n.t(LOC_KEYS.choiceGroupFalse)}`
    }
];

const getClassNames = classNamesFunction<
    IConditionSummaryStyleProps,
    IConditionSummaryStyles
>();

const ConditionSummary: React.FC<IConditionSummaryProps> = (props) => {
    const {
        areValuesValid,
        conditionType,
        onChangeValues,
        currentValues,
        styles
    } = props;

    // Hooks
    const { t } = useTranslation();

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

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const renderNumericalSummary = () => {
        return (
            <Stack>
                <Stack horizontal={true} tokens={STACK_TOKENS}>
                    <BoundaryInput
                        value={currentValues?.[0] as string}
                        boundary={BoundaryType.min}
                        setNewValues={(value: string) => {
                            onChangeValues(
                                conditionType,
                                [Number(value)] as number[],
                                0
                            );
                        }}
                        setValueToInfinity={(value: string) => {
                            onChangeValues(
                                conditionType,
                                [value] as string[],
                                0
                            );
                        }}
                    />
                    <BoundaryInput
                        value={currentValues?.[1] as string}
                        boundary={BoundaryType.max}
                        setNewValues={(value: string) => {
                            onChangeValues(
                                conditionType,
                                [Number(value)] as number[],
                                1
                            );
                        }}
                        setValueToInfinity={(value: string) => {
                            onChangeValues(
                                conditionType,
                                [value] as string[],
                                1
                            );
                        }}
                    />
                </Stack>
                {!areValuesValid && (
                    <div className={classNames.invalidText}>
                        {t(LOC_KEYS.invalidRanges)}
                    </div>
                )}
            </Stack>
        );
    };

    const renderBooleanSummary = () => {
        return (
            <ChoiceGroup
                selectedKey={String(currentValues?.[0])}
                options={getChoiceGroupOptions()}
                onChange={(_ev, option) => {
                    // Comparison turns value into correct boolean
                    onChangeValues(conditionType, [
                        option.key === 'true'
                    ] as boolean[]);
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
        <Stack tokens={STACK_TOKENS}>
            <h4 className={classNames.title}>
                {conditionType === 'boolean'
                    ? t(LOC_KEYS.flyoutValueTitle)
                    : t(LOC_KEYS.flyoutValuesTitle)}
            </h4>
            {renderFields()}
        </Stack>
    );
};

export default styled<
    IConditionSummaryProps,
    IConditionSummaryStyleProps,
    IConditionSummaryStyles
>(ConditionSummary, getStyles);
