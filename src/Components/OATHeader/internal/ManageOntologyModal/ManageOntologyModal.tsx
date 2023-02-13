import React, { useEffect, useState } from 'react';
import {
    classNamesFunction,
    useTheme,
    styled,
    Link,
    TextField,
    Toggle
} from '@fluentui/react';
import {
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles,
    IManageOntologyModalProps,
    FormMode
} from './ManageOntologyModal.types';
import { getStyles } from './ManageOntologyModal.styles';
import { buildModelId } from '../../../../Models/Services/OatUtils';
import CardboardModal from '../../../CardboardModal/CardboardModal';
import {
    DOCUMENTATION_LINKS,
    OAT_DEFAULT_PATH_VALUE
} from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../../Models/Context/OatPageContext/OatPageContext.types';
import {
    DTDL_CONTEXT_VERSION_2,
    DTDL_CONTEXT_VERSION_3
} from '../../../../Models/Classes/DTDL';

const LOC_KEYS = {
    deleteButtonText: `OAT.Header.ManageOntologyModal.deleteButtonText`,
    modalSubTitleCreate: `OAT.Header.ManageOntologyModal.modalSubTitleCreate`,
    modalSubTitleEdit: `OAT.Header.ManageOntologyModal.modalSubTitleEdit`,
    modalSubTitleLinkText: `OAT.Header.ManageOntologyModal.modalSubTitleLinkText`,
    modalTitleCreate: `OAT.Header.ManageOntologyModal.modalTitleCreate`,
    modalTitleEdit: `OAT.Header.ManageOntologyModal.modalTitleEdit`,
    nameLabel: 'OAT.Header.ManageOntologyModal.nameLabel',
    namePlaceholder: 'OAT.Header.ManageOntologyModal.namePlaceholder',
    namespaceDescription: 'OAT.Header.ManageOntologyModal.namespaceDescription',
    namespaceLabel: 'OAT.Header.ManageOntologyModal.namespaceLabel',
    namespacePlaceholder: 'OAT.Header.ManageOntologyModal.namespacePlaceholder',
    sampleModel: 'OAT.Header.ManageOntologyModal.sampleModel',
    toggleLabel: 'OAT.Header.ManageOntologyModal.defaultVersionLabel',
    toggleVersion2: 'OAT.Header.ManageOntologyModal.version2',
    toggleVersion3: 'OAT.Header.ManageOntologyModal.version3'
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
    const [defaultPath, setDefaultPath] = useState<string>(
        mode === FormMode.Create ? '' : oatPageState.currentOntologyDefaultPath
    );
    const [isV3Default, setIsV3Default] = useState<boolean>(
        mode === FormMode.Create
            ? false
            : oatPageState.currentOntologyDefaultContext ===
                  DTDL_CONTEXT_VERSION_3
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
                        type: OatPageContextActionType.DELETE_PROJECT,
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
                type: OatPageContextActionType.CREATE_PROJECT,
                payload: {
                    name: name,
                    defaultPath: defaultPath,
                    defaultContext: isV3Default
                        ? DTDL_CONTEXT_VERSION_3
                        : DTDL_CONTEXT_VERSION_2
                }
            });
        } else if (mode === FormMode.Edit) {
            oatPageDispatch({
                type: OatPageContextActionType.EDIT_PROJECT,
                payload: {
                    name: name,
                    defaultPath: defaultPath,
                    defaultContext: isV3Default
                        ? DTDL_CONTEXT_VERSION_3
                        : DTDL_CONTEXT_VERSION_2
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

    // side effect
    useEffect(() => {
        const localName =
            mode === FormMode.Create
                ? ''
                : oatPageState.currentOntologyProjectName;
        setName(localName);
    }, [isOpen, mode, oatPageState.currentOntologyProjectName]);
    useEffect(() => {
        const localPath =
            mode === FormMode.Create
                ? ''
                : oatPageState.currentOntologyDefaultPath;
        setDefaultPath(localPath);
    }, [isOpen, mode, oatPageState.currentOntologyDefaultPath]);
    useEffect(() => {
        const isV3 =
            mode === FormMode.Create
                ? false
                : oatPageState.currentOntologyDefaultContext ===
                  DTDL_CONTEXT_VERSION_3;
        setIsV3Default(isV3);
    }, [isOpen, mode, oatPageState.currentOntologyDefaultContext]);

    // data
    const sampleModelId = buildModelId({
        path: defaultPath || OAT_DEFAULT_PATH_VALUE,
        modelName: t(LOC_KEYS.sampleModel)
    });

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const isFormValid = name?.trim();

    return (
        <CardboardModal
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
                onChange={(_e, value) => setName(value)}
                placeholder={t(LOC_KEYS.namePlaceholder)}
                required
                value={name}
            />
            <TextField
                description={t(LOC_KEYS.namespaceDescription, {
                    modelName: sampleModelId
                })}
                label={t(LOC_KEYS.namespaceLabel)}
                onChange={(_e, value) =>
                    setDefaultPath(value.replace(/ /g, ''))
                }
                placeholder={t(LOC_KEYS.namespacePlaceholder)}
                value={defaultPath}
            />
            <Toggle
                label={t(LOC_KEYS.toggleLabel)}
                defaultChecked={isV3Default}
                offText={t(LOC_KEYS.toggleVersion2)}
                onText={t(LOC_KEYS.toggleVersion3)}
                onChange={(_ev, checked) => {
                    setIsV3Default(checked);
                }}
            />
        </CardboardModal>
    );
};

export default styled<
    IManageOntologyModalProps,
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
>(ManageOntologyModal, getStyles);
