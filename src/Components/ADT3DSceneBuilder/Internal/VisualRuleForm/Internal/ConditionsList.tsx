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
    const { t } = useTranslation();

    const noDataMessageLinkProps: ILinkProps = {
        onClick: () => {
            alert('Add condition clicked');
        }
    };
    // Temporary
    // Set this to true or false to show no data message
    const noData = false;

    if (!noData) {
        return (
            <div className={classNames.container}>
                <CardboardList<ConditionsMockData>
                    listKey={LIST_KEY}
                    items={ConditionsMockList}
                />
            </div>
        );
    } else {
        return (
            <IllustrationMessage
                headerText={t(
                    '3dSceneBuilder.visualRuleForm.noDataMessageHeader'
                )}
                descriptionText={t(
                    '3dSceneBuilder.visualRuleForm.noDataMessageDescription'
                )}
                type={'info'}
                width={'compact'}
                linkProps={noDataMessageLinkProps}
                linkText={t(
                    '3dSceneBuilder.visualRuleForm.noDataMessageLinkText'
                )}
            />
        );
    }
};

export default styled<
    IConditionsListProps,
    IConditionsListStylesProps,
    IConditionsListStyles
>(ConditionsList, getStyles);
