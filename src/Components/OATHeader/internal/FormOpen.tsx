import React, { useState, useEffect } from 'react';
import {
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack,
    Dropdown
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IAction } from '../../../Models/Constants/Interfaces';
import {
    OATDataStorageKey,
    OATFilesStorageKey
} from '../../../Models/Constants';
import {
    SET_OAT_PROJECT_NAME,
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_RELOAD_PROJECT
} from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormOpen = ({ dispatch, setModalOpen, setModalBody }: IModal) => {
    const { t } = useTranslation();
    const headerStyles = getHeaderStyles();
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOpen = () => {
        dispatch({
            type: SET_OAT_PROPERTY_EDITOR_MODEL,
            payload: null
        });

        dispatch({
            type: SET_OAT_PROJECT_NAME,
            payload: selectedFile.text
        });

        dispatch({
            type: SET_OAT_RELOAD_PROJECT,
            payload: true
        });

        localStorage.setItem(
            OATDataStorageKey,
            JSON.stringify(selectedFile.key)
        );

        setModalBody('');
        setModalOpen(false);
    };

    const formatFilesToDropDownOptions = () => {
        const storedFiles = JSON.parse(
            localStorage.getItem(OATFilesStorageKey)
        );
        if (storedFiles.length > 0) {
            const formattedFiles = storedFiles.map((file) => {
                return {
                    key: file.data,
                    text: file.name
                };
            });

            setFiles(formattedFiles);
        }
    };

    useEffect(() => {
        formatFilesToDropDownOptions();
    }, []);

    return (
        <Stack>
            <div className={headerStyles.modalRowFlexEnd}>
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>Select file:</Text>
                <Dropdown
                    placeholder="Files"
                    options={files}
                    onChange={(_ev, option) => setSelectedFile(option)}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.open')}
                    onClick={handleOpen}
                    disabled={!selectedFile}
                />

                <PrimaryButton
                    text={t('OATHeader.cancel')}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Stack>
    );
};

export default FormOpen;
