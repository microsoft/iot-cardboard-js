import React from 'react';
import {
    IDataHistoryExplorerModalProps,
    IDataHistoryExplorerModalStyleProps,
    IDataHistoryExplorerModalStyles
} from './DataHistoryExplorerModal.types';
import { getStyles } from './DataHistoryExplorerModal.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IStackTokens
} from '@fluentui/react';
import CardboardModal from '../CardboardModal/CardboardModal';
import { useTranslation } from 'react-i18next';
import DataHistoryExplorer from '../DataHistoryExplorer/DataHistoryExplorer';
import { useGuid } from '../../Models/Hooks';

const CONTENT_MAX_HEIGHT = 560;
const contentStackTokens: IStackTokens = {
    maxHeight: CONTENT_MAX_HEIGHT
};

const getClassNames = classNamesFunction<
    IDataHistoryExplorerModalStyleProps,
    IDataHistoryExplorerModalStyles
>();

const DataHistoryExplorerModal: React.FC<IDataHistoryExplorerModalProps> = (
    props
) => {
    const guid = useGuid();
    const {
        adapter,
        isOpen,
        onDismiss,
        timeSeriesTwins,
        dataHistoryInstanceId = guid,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <div className={classNames.root}>
            <CardboardModal
                contentStackProps={{ tokens: contentStackTokens }}
                isOpen={isOpen}
                onDismiss={onDismiss}
                styles={classNames.subComponentStyles.modal}
                title={t('dataHistoryExplorer.title')}
                titleIconName={'Chart'}
                footerDefaultButtonProps={{
                    text: t('close')
                }}
            >
                <DataHistoryExplorer
                    adapter={adapter}
                    hasTitle={false}
                    timeSeriesTwins={timeSeriesTwins}
                    dataHistoryInstanceId={dataHistoryInstanceId}
                />
            </CardboardModal>
        </div>
    );
};

export default styled<
    IDataHistoryExplorerModalProps,
    IDataHistoryExplorerModalStyleProps,
    IDataHistoryExplorerModalStyles
>(DataHistoryExplorerModal, getStyles);
