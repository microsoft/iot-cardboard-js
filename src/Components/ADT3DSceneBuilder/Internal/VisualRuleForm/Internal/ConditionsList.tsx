import {
    classNamesFunction,
    ILinkProps,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import IllustrationMessage from '../../../../IllustrationMessage/IllustrationMessage';
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
    // const { t } = useTranslation();

    return (
        <div className={classNames.container}>
            <CardboardList<ConditionsMockData>
                listKey={LIST_KEY}
                items={ConditionsMockList}
            />
            {/* TODO: Add button */}
        </div>
    );
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
