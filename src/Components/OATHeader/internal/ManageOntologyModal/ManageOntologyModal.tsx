import React, { useMemo, useState } from 'react';
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
import {
    buildModelName,
    getOntologiesFromStorage
} from '../../../../Models/Services/OatUtils';
import OatModal from '../../../CardboardModal/CardboardModal';
import { DOCUMENTATION_LINKS } from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';

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
    // const { oatPageDispatch, oatPageState } = useOatPageContext();

    // state
    const [name, setName] = useState<string>('');
    const [namespace, setNamespace] = useState<string>('');

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onDelete = () => {
        alert('Delete');
    };
    const onSubmit = () => {
        alert('submit');
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

    // side effects

    // data
    const storedFiles = useMemo(() => getOntologiesFromStorage(), []);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const currentFile = storedFiles.find((x) => x.id === ontologyId);
    const sampleModelName = buildModelName(
        namespace || t(LOC_KEYS.sampleNamespace),
        t(LOC_KEYS.sampleModel),
        1
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

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
                onClick: onSubmit
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
                onChange={(_e, value) => setNamespace(value)}
            />
        </OatModal>
    );
};

export default styled<
    IManageOntologyModalProps,
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
>(ManageOntologyModal, getStyles);
