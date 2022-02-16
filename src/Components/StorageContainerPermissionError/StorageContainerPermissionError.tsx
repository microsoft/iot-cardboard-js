import React from 'react';
import { IErrorComponentProps } from '../../Models/Constants';
import './StorageContainerPermissionError.scss';
import { MessageBar, MessageBarType } from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { useTranslation } from 'react-i18next';

const StorageContainerPermissionError: React.FC<IErrorComponentProps> = ({
    errorType
}) => {
    const { t } = useTranslation();
    return (
        <BaseComponent containerClassName="cb-message-bar-container">
            <MessageBar
                messageBarType={MessageBarType.warning}
                isMultiline={false}
                onDismiss={null}
                dismissButtonAriaLabel={t('close')}
                className="cb-scene-page-warning-message"
            >
                {t(errorType)}
            </MessageBar>
        </BaseComponent>
    );
};

export default React.memo(StorageContainerPermissionError);
