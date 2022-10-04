import React, { useState } from 'react';
import {
    classNamesFunction,
    useTheme,
    styled,
    TextField,
    Link
} from '@fluentui/react';
import {
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles,
    IManageOntologyModalProps,
    FormMode
} from './ManageOntologyModal.types';
import { getStyles } from './ManageOntologyModal.styles';
import { buildModelName } from '../../../../Models/Services/OatUtils';
import OatModal from '../../../CardboardModal/CardboardModal';
import { DOCUMENTATION_LINKS } from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';

const LOC_KEYS = {
    deleteButtonText: `OATHeader.manageOntologyModal.deleteButtonText`,
    modalTitleCreate: `OATHeader.manageOntologyModal.modalTitleCreate`,
    modalTitleEdit: `OATHeader.manageOntologyModal.modalTitleEdit`,
    modalSubTitleCreate: `OATHeader.manageOntologyModal.modalSubTitleCreate`,
    modalSubTitleEdit: `OATHeader.manageOntologyModal.modalSubTitleEdit`,
    modalSubTitleLinkText: `OATHeader.manageOntologyModal.modalSubTitleLinkText`,
    nameLabel: 'OATHeader.manageOntologyModal.nameLabel',
    namePlaceholder: 'OATHeader.manageOntologyModal.namePlaceholder',
    namespaceDescription: 'OATHeader.manageOntologyModal.namespaceDescription',
    namespaceLabel: 'OATHeader.manageOntologyModal.namespaceLabel',
    namespacePlaceholder: 'OATHeader.manageOntologyModal.namespacePlaceholder',
    sampleModel: 'OATHeader.manageOntologyModal.sampleModel',
    sampleNamespace: 'OATHeader.manageOntologyModal.sampleNamespace'
};

const getClassNames = classNamesFunction<
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
>();

const ManageOntologyModal: React.FC<IManageOntologyModalProps> = (props) => {
    const { isOpen, onClose, ontologyId, styles } = props;
    const mode = ontologyId ? FormMode.Edit : FormMode.Create;

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [name, setName] = useState<string>(
        mode === FormMode.Create ? '' : oatPageState.currentOntologyProjectName
    );
    const [namespace, setNamespace] = useState<string>(
        mode === FormMode.Create ? '' : oatPageState.currentOntologyNamespace
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onDelete = () => {
        oatPageDispatch({
            type: OatPageContextActionType.SET_OAT_CONFIRM_DELETE_OPEN,
            payload: {
                open: true,
                callback: () => {
                    onClose();
                    oatPageDispatch({
                        type: OatPageContextActionType.SET_OAT_DELETE_PROJECT,
                        payload: {
                            id: ontologyId
                        }
                    });
                }
            }
        });
    };
    const onSubmit = () => {
        if (mode === FormMode.Create) {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_CREATE_PROJECT,
                payload: {
                    name: name,
                    namespace: namespace
                }
            });
        } else if (mode === FormMode.Edit) {
            oatPageDispatch({
                type: OatPageContextActionType.SET_OAT_EDIT_PROJECT,
                payload: {
                    name: name,
                    namespace: namespace
                }
            });
        }
        onClose();
    };

    const onRenderSubTitle = (): React.ReactNode => {
        return (
            <>
                {mode === FormMode.Create && t(LOC_KEYS.modalSubTitleCreate)}
                {mode === FormMode.Edit && t(LOC_KEYS.modalSubTitleEdit)}{' '}
                <Link
                    target="_blank"
                    href={DOCUMENTATION_LINKS.ontologyConcepts}
                >
                    {t(LOC_KEYS.modalSubTitleLinkText)}
                </Link>
            </>
        );
    };

    // data
    const sampleModelName = buildModelName(
        namespace || t(LOC_KEYS.sampleNamespace),
        t(LOC_KEYS.sampleModel),
        1
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const isFormValid = name && namespace;

    return (
        <OatModal
            isOpen={isOpen}
            footerDangerButtonProps={
                mode === FormMode.Create
                    ? null
                    : {
                          text: t(LOC_KEYS.deleteButtonText),
                          onClick: onDelete
                      }
            }
            footerPrimaryButtonProps={{
                text: mode === FormMode.Create ? t('create') : t('save'),
                onClick: onSubmit,
                disabled: !isFormValid
            }}
            onDismiss={onClose}
            styles={classNames.subComponentStyles.modal}
            subTitle={onRenderSubTitle}
            title={
                mode === FormMode.Create
                    ? t(LOC_KEYS.modalTitleCreate)
                    : t(LOC_KEYS.modalTitleEdit)
            }
        >
            <TextField
                label={t(LOC_KEYS.nameLabel)}
                placeholder={t(LOC_KEYS.namePlaceholder)}
                value={name}
                onChange={(_e, value) => setName(value)}
            />
            <TextField
                label={t(LOC_KEYS.namespaceLabel)}
                placeholder={t(LOC_KEYS.namespacePlaceholder)}
                description={t(LOC_KEYS.namespaceDescription, {
                    modelName: sampleModelName
                })}
                value={namespace}
                onChange={(_e, value) => setNamespace(value.replace(/ /g, ''))}
            />
        </OatModal>
    );
};

export default styled<
    IManageOntologyModalProps,
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
>(ManageOntologyModal, getStyles);
