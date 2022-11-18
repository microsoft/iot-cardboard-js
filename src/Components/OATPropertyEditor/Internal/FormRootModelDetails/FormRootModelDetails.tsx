import React, { useEffect, useState } from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import CardboardModal from '../../../CardboardModal/CardboardModal';
import FormRootModelDetailsContent from '../FormRootModelDetailsContent/FormRootModelDetailsContent';
import {
    IFormRootModelDetailsStyleProps,
    IFormRootModelDetailsStyles,
    IModalFormRootModelProps
} from './FormRootModelDetails.types';
import { getStyles } from './FormRootModelDetails.styles';
import { useTranslation } from 'react-i18next';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import ModelPropertyHeader from '../ModelPropertyHeader/ModelPropertyHeader';
import { getModelPropertyListItemName } from '../../Utils';
import { isDTDLReference } from '../../../../Models/Services/DtdlUtils';

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
        setLocalDraft(selectedItem);
    }, [selectedItem]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <CardboardModal
            isOpen={isOpen}
            footerPrimaryButtonProps={{
                text: t('update'),
                onClick: () => {
                    onSubmit(localDraft);
                    onClose();
                }
            }}
            onDismiss={onClose}
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
                selectedItem={selectedItem}
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
