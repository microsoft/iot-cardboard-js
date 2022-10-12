import {
    ActionButton,
    classNamesFunction,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import { getStyles } from './ConditionsList.styles';
import {
    IConditionsListProps,
    IConditionsListStyles,
    IConditionsListStylesProps
} from './ConditionsList.types';
import { ConditionsMockData, ConditionsMockList } from './ConditionsMock';

const LIST_KEY = 'cb-visual-rule-conditions-list';

const getClassNames = classNamesFunction<
    IConditionsListStylesProps,
    IConditionsListStyles
>();

const ConditionsList: React.FC<IConditionsListProps> = (props) => {
    // Props
    const { styles } = props;

    // Styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // Hooks
    const { t } = useTranslation();
    const handleNewCondition = useCallback(() => {
        // TODO: Open callout
        alert('New condition');
    }, []);

    return (
        <div className={classNames.container}>
            <Stack>
                <CardboardList<ConditionsMockData>
                    listKey={LIST_KEY}
                    items={ConditionsMockList}
                />
                <ActionButton
                    data-testid={'visual-rule-add-condition'}
                    styles={classNames.subComponentStyles.addButton?.()}
                    onClick={handleNewCondition}
                >
                    {t('3dSceneBuilder.visualRuleForm.newCondition')}
                </ActionButton>
            </Stack>
        </div>
    );
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
