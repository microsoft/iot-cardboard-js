import React, { useEffect, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import CardboardModal from '../../../CardboardModal/CardboardModal';
import FormRootModelDetailsContent from './Internal/FormRootModelDetailsContent/PropertyDetailsEditorModalContent';
import {
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles,
    IModalFormRootModelProps
} from './PropertyDetailsEditorModal.types';
import { getStyles } from './PropertyDetailsEditorModal.styles';
import { useTranslation } from 'react-i18next';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import ModelPropertyHeader from '../ModelPropertyHeader/ModelPropertyHeader';
import { getModelPropertyListItemName } from '../../Utils';
import { isDTDLReference } from '../../../../Models/Services/DtdlUtils';
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FormRootModelDetails', debugLogging);

const getClassNames = classNamesFunction<
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
>();

export const FormRootModelDetails: React.FC<IModalFormRootModelProps> = (
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
                                : getModelPropertyListItemName(
                                      selectedItem.displayName
                                  )
                        }
                        entityType={selectedItem['@type']?.toString() || ''}
                    />
                );
            }}
            styles={classNames.subComponentStyles.root}
        >
            <FormRootModelDetailsContent
                onUpdateItem={setLocalDraft}
                selectedItem={localDraft}
                styles={classNames.subComponentStyles.content}
            />
        </CardboardModal>
    );
};

export default styled<
    IModalFormRootModelProps,
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles
>(FormRootModelDetails, getStyles);
