import {
    ActionButton,
    classNamesFunction,
    Icon,
    IContextualMenuItem,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDefaultVisualRuleCondition } from '../../../../../Models/Classes/3DVConfig';
import {
    IExpressionRangeType,
    IValueRange
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { defaultSwatchColors } from '../../../../../Theming/Palettes';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { classNames as cardboardListItemClassNames } from '../../../../CardboardList/CardboardListItem.styles';
import {
    getNextColor,
    transformValueRangesIntoConditions
} from '../VisualRuleFormUtility';
import { hasBadge } from './ConditionsCallout/ConditionCalloutUtility';
import ConditionsCallout from './ConditionsCallout/ConditionsCallout';
import {
    getBadgeStyles,
    getMeshColoringStyles,
    getStyles
} from './ConditionsList.styles';
import {
    CalloutInfo,
    CalloutInfoType,
    Condition,
    IConditionsListProps,
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';

const getClassNames = classNamesFunction<
    IConditionsListStylesProps,
    IConditionsListStyles
>();

const defaultCalloutInfo: CalloutInfo = {
    calloutType: CalloutInfoType.inactive,
    selectedCondition: null,
    selectedTarget: ''
};

const ConditionsList: React.FC<IConditionsListProps> = (props) => {
    // Props
    const {
        expressionType,
        onDeleteCondition,
        onSaveCondition,
        styles,
        valueRanges,
        valueRangeType
    } = props;

    // Hooks
    const { t } = useTranslation();
    const LIST_KEY = useId('cb-visual-rule-conditions-list');

    // Constants
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [calloutInfo, setCalloutInfo] = useState<CalloutInfo>(
        defaultCalloutInfo
    );

    // Callbacks
    const handleOpenNewConditionFlyout = useCallback(() => {
        setCalloutInfo({
            calloutType: CalloutInfoType.create,
            selectedCondition: getDefaultVisualRuleCondition(
                valueRangeType,
                getNextColor(valueRanges, defaultSwatchColors)
            ),
            selectedTarget: `#${LIST_KEY}`
        });
    }, [valueRangeType]);

    const handleDismissFlyout = useCallback(() => {
        setCalloutInfo(defaultCalloutInfo);
    }, []);

    const getOverflowMenuItems = useCallback(
        (conditionId: string): IContextualMenuItem[] => [
            {
                key: `${conditionId}-edit-menu-item`,
                text: t('3dSceneBuilder.visualRuleForm.editCondition'),
                iconProps: {
                    iconName: 'Edit'
                },
                onClick: () => {
                    setCalloutInfo({
                        calloutType: CalloutInfoType.edit,
                        selectedCondition: valueRanges.find(
                            (vr) => vr.id === conditionId
                        ),
                        selectedTarget: `#${LIST_KEY}`
                    });
                },
                data: {
                    id: conditionId
                }
            },
            {
                key: `${conditionId}-delete-menu-item`,
                text: t('3dSceneBuilder.visualRuleForm.deleteCondition'),
                iconProps: {
                    iconName: 'Delete'
                },
                onClick: (_ev, item) => {
                    onDeleteCondition(item.data.id);
                    handleDismissFlyout();
                },
                data: {
                    id: conditionId
                }
            }
        ],
        [handleDismissFlyout, onDeleteCondition, t, valueRanges]
    );

    const renderBadge = useCallback((iconName: string, color: string) => {
        return <Icon iconName={iconName} styles={getBadgeStyles(color)} />;
    }, []);

    const renderMeshColoring = useCallback((color: string) => {
        return (
            <Icon
                iconName={'CubeShape'}
                styles={getMeshColoringStyles(color)}
            />
        );
    }, []);

    const getConditionItems = useCallback(
        (
            valueRanges: IValueRange[],
            expressionType: IExpressionRangeType
        ): ICardboardListItem<Condition>[] => {
            const conditions = transformValueRangesIntoConditions(
                valueRanges,
                expressionType,
                t
            );
            const viewModel: ICardboardListItem<Condition>[] = conditions.map(
                (condition) => {
                    const primaryTextClassName = `.${cardboardListItemClassNames.primaryText}`;
                    const showBadgeIcon = hasBadge(condition.iconName);
                    return {
                        item: condition,
                        ariaLabel: `Condition for ${condition.primaryText}`,
                        textPrimary: condition.primaryText,
                        textSecondary: condition.secondaryText,
                        overflowMenuItems: getOverflowMenuItems(condition.id),
                        iconStart: showBadgeIcon
                            ? () =>
                                  renderBadge(
                                      condition.iconName,
                                      condition.color
                                  )
                            : () => renderMeshColoring(condition.color),
                        onClick: () => {
                            setCalloutInfo({
                                calloutType: CalloutInfoType.edit,
                                selectedCondition: valueRanges.find(
                                    (vr) => vr.id === condition.id
                                ),
                                selectedTarget: `#${LIST_KEY}`
                            });
                        },
                        buttonProps: {
                            customStyles: {
                                root: {
                                    [primaryTextClassName]: {
                                        fontStyle: condition.isUnlabeled
                                            ? 'italic'
                                            : 'normal'
                                    }
                                }
                            }
                        }
                    };
                }
            );
            return viewModel;
        },
        [getOverflowMenuItems, t]
    );

    // State
    const [conditions, setConditions] = useState(
        getConditionItems(valueRanges, expressionType)
    );

    // Effects
    // Update list everytime valueRanges and expressionType change
    useEffect(() => {
        setConditions(getConditionItems(valueRanges, expressionType));
    }, [valueRanges, expressionType, getConditionItems]);

    return (
        <>
            <div className={classNames.root}>
                <Stack>
                    <CardboardList<Condition>
                        listProps={{
                            id: LIST_KEY
                        }}
                        listKey={LIST_KEY}
                        items={conditions}
                    />
                    <ActionButton
                        id={'visual-rule-add-condition'}
                        data-testid={'visual-rule-add-condition'}
                        styles={classNames.subComponentStyles.addButton?.()}
                        onClick={handleOpenNewConditionFlyout}
                    >
                        {t('3dSceneBuilder.visualRuleForm.newCondition')}
                    </ActionButton>
                </Stack>
            </div>
            {calloutInfo.calloutType !== CalloutInfoType.inactive && (
                <ConditionsCallout
                    calloutType={calloutInfo.calloutType}
                    onDismiss={handleDismissFlyout}
                    onSave={onSaveCondition}
                    target={calloutInfo.selectedTarget}
                    valueRange={calloutInfo.selectedCondition}
                    valueRangeType={valueRangeType}
                />
            )}
        </>
    );
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
