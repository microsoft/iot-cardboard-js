import React, { useCallback, useMemo, useState } from 'react';
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
import { getOntologiesFromStorage } from '../../../../Models/Services/OatUtils';
import { useOatPageContext } from '../../../../Models/Context/OatPageContext/OatPageContext';
import OatModal from '../../../CardboardModal/CardboardModal';
import { DOCUMENTATION_LINKS } from '../../../../Models/Constants/Constants';
import { useTranslation } from 'react-i18next';

const ROOT_LOC = 'OATHeader.manageOntologyModal';
const LOC_KEYS = {
    modalTitleCreate: `${ROOT_LOC}.modalTitleCreate`,
    modalTitleEdit: `${ROOT_LOC}.modalTitleEdit`,
    modalSubTitleCreate: `${ROOT_LOC}.modalSubTitleCreate`,
    modalSubTitleEdit: `${ROOT_LOC}.modalSubTitleEdit`,
    modalSubTitleLinkText: `${ROOT_LOC}.modalSubTitleLinkText`
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

    // side effects

    // data
    const storedFiles = useMemo(() => getOntologiesFromStorage(), []);
    const currentFile = storedFiles.find((x) => x.id === ontologyId);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <>
            <OatModal
                isOpen={isOpen}
                footerDangerButtonProps={{
                    text: 'Destroy',
                    onClick: onDelete
                }}
                footerPrimaryButtonProps={{
                    text: 'Submit',
                    onClick: onSubmit
                }}
                onDismiss={onClose}
                styles={classNames.subComponentStyles.modal}
                subTitle={() => {
                    return (
                        <>
                            {mode === FormMode.Create &&
                                t(LOC_KEYS.modalSubTitleCreate)}
                            {mode === FormMode.Edit &&
                                t(LOC_KEYS.modalSubTitleEdit)}{' '}
                            <Link
                                target="_blank"
                                href={DOCUMENTATION_LINKS.ontologyConcepts}
                            >
                                {t(LOC_KEYS.modalSubTitleLinkText)}
                            </Link>
                        </>
                    );
                }}
                title={'Header'}
            >
                <TextField
                    label={'Name'}
                    placeholder={'Ontology name'}
                    value={name}
                    onChange={(_e, value) => setName(value)}
                />
                <TextField
                    label={'Namespace'}
                    placeholder={'Enter a namespace'}
                    description={''}
                    value={namespace}
                    onChange={(_e, value) => setNamespace(value)}
                />
            </OatModal>
        </>
    );
};

export default styled<
    IManageOntologyModalProps,
    IManageOntologyModalStyleProps,
    IManageOntologyModalStyles
>(ManageOntologyModal, getStyles);
