import React, { useEffect, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import CardboardModal from '../../../CardboardModal/CardboardModal';
import {
    IPropertyDetailsEditorModalStyleProps,
    IPropertyDetailsEditorModalStyles,
    IModalFormRootModelProps
} from './PropertyDetailsEditorModal.types';
import PropertyDetailsEditorModalContent from './Internal/FormRootModelDetailsContent/PropertyDetailsEditorModalContent';
import { getStyles } from './PropertyDetailsEditorModal.styles';
import { useTranslation } from 'react-i18next';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import ModelPropertyHeader from '../ModelPropertyHeader/ModelPropertyHeader';
import { isDTDLReference } from '../../../../Models/Services/DtdlUtils';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { getUniqueModelName } from '../../../../Models/Services/OatUtils';

const debugLogging = false;
const logDebugConsole = getDebugLogger(
    'PropertyDetailsEditorModal',
    debugLogging
);

const getClassNames = classNamesFunction<
    IPropertyDetailsEditorModalStyleProps,
    IPropertyDetailsEditorModalStyles
>();

export const PropertyDetailsEditorModal: React.FC<IModalFormRootModelProps> = (
    props
) => {
    const { isOpen, onClose, onSubmit, selectedItem, styles } = props;

    // hooks
    const { t } = useTranslation();

    // contexts

    // data

    // state
    const [localDraft, setLocalDraft] = useState(selectedItem);

    // callbacks

    // data

    // side effects
    useEffect(() => {
        logDebugConsole('debug', 'Updating local draft. {item}', selectedItem);
        setLocalDraft(selectedItem);
    }, [selectedItem]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render. {item}', localDraft);
    return (
        <CardboardModal
            isOpen={isOpen}
            footerPrimaryButtonProps={{
                text: t('update'),
                onClick: () => {
                    logDebugConsole('info', 'Saving. {data}', localDraft);
                    onSubmit(localDraft);
                    onClose();
                }
            }}
            onDismiss={() => {
                onClose();
                setLocalDraft(selectedItem);
            }}
            title={() => {
                return (
                    <ModelPropertyHeader
                        entityId={selectedItem?.['@id']}
                        entityName={
                            isDTDLReference(selectedItem)
                                ? selectedItem.name
                                : getUniqueModelName(selectedItem)
                        }
                        entityType={selectedItem['@type']?.toString() || ''}
                    />
                );
            }}
            styles={classNames.subComponentStyles.root}
        >
            <PropertyDetailsEditorModalContent
                onUpdateItem={setLocalDraft}
                selectedItem={localDraft}
                styles={classNames.subComponentStyles.content}
            />
        </CardboardModal>
    );
};

export default styled<
    IModalFormRootModelProps,
    IPropertyDetailsEditorModalStyleProps,
    IPropertyDetailsEditorModalStyles
>(PropertyDetailsEditorModal, getStyles);
