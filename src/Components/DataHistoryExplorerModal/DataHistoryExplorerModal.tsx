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

const CONTENT_MAX_HEIGHT = 515;
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
    const { adapter, isOpen, onDismiss, styles } = props;

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
            >
                <DataHistoryExplorer adapter={adapter} hasTitle={false} />
            </CardboardModal>
        </div>
    );
};

export default styled<
    IDataHistoryExplorerModalProps,
    IDataHistoryExplorerModalStyleProps,
    IDataHistoryExplorerModalStyles
>(DataHistoryExplorerModal, getStyles);
