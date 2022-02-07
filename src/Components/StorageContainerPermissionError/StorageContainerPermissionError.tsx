import React from 'react';
import { IErrorComponentProps } from '../../Models/Constants';
import './StorageContainerPermissionError';
import { MessageBar, MessageBarType } from '@fluentui/react';

const StorageContainerPermissionError: React.FC<IErrorComponentProps> = ({
    errorContent
}) => {
    return (
        <MessageBar
            messageBarType={MessageBarType.warning}
            isMultiline={false}
            onDismiss={null}
            dismissButtonAriaLabel={'Close'}
            className="cb-scene-page-warning-message"
        >
            {errorContent}
        </MessageBar>
    );
};

export default React.memo(StorageContainerPermissionError);
