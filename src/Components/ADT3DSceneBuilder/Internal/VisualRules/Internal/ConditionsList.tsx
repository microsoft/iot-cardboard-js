import { ILinkProps } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CardboardList } from '../../../../CardboardList';
import IllustrationMessage from '../../../../IllustrationMessage/IllustrationMessage';
import { ConditionsMockData, ConditionsMockList } from './ConditionsMock';

const LIST_KEY = 'cb-visual-rule-conditions-list';

export const ConditionsList: React.FC<any> = (_props) => {
    // Props
    // const { listItems = [] } = props;

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
            <div style={{ overflow: 'auto', maxHeight: '100%' }}>
                <CardboardList<ConditionsMockData>
                    listKey={LIST_KEY}
                    items={ConditionsMockList}
                />
            </div>
        );
    } else {
        return (
            <IllustrationMessage
                headerText={t('3dSceneBuilder.visualRule.noDataMessageHeader')}
                descriptionText={t(
                    '3dSceneBuilder.visualRule.noDataMessageDescription'
                )}
                type={'info'}
                width={'compact'}
                linkProps={noDataMessageLinkProps}
                linkText={t('3dSceneBuilder.visualRule.noDataMessageLinkText')}
            />
        );
    }
};
