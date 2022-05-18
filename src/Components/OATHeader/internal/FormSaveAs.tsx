import React, { useState } from 'react';
import {
    TextField,
    Text,
    ActionButton,
    FontIcon,
    PrimaryButton,
    Stack
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { IAction } from '../../../Models/Constants/Interfaces';
import {
    OATDataStorageKey,
    OATFilesStorageKey
} from '../../../Models/Constants';
import { SET_OAT_PROJECT_NAME } from '../../../Models/Constants/ActionTypes';
import { getHeaderStyles } from '../OATHeader.styles';

interface IModal {
    dispatch?: React.Dispatch<React.SetStateAction<IAction>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FormSaveAs = ({
    dispatch,
    setModalOpen,
    setModalBody
}: IModal) => {
    const { t } = useTranslation();
    const [projectName, setProjectName] = useState('');
    const headerStyles = getHeaderStyles();

    const handleOnSave = () => {
        const editorData = JSON.parse(localStorage.getItem(OATDataStorageKey));

        // Find if project name already exists
        const files = JSON.parse(localStorage.getItem(OATFilesStorageKey));
        console.log('files', files);
        const fileAlreadyExists = files.some(
            (file) => file.name === projectName
        );

        console.log('fileAlreadyExists', fileAlreadyExists);
        if (fileAlreadyExists) {
            console.log('File already exists');
            return;
        }

        dispatch({
            type: SET_OAT_PROJECT_NAME,
            payload: projectName
        });

        // Save file
        files.push({
            name: projectName,
            data: editorData
        });
        localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));

        setModalOpen(false);
        setModalBody('');
    };

    return (
        <Stack>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}
            >
                <ActionButton onClick={() => setModalOpen(false)}>
                    <FontIcon iconName={'ChromeClose'} />
                </ActionButton>
            </div>

            <div className={headerStyles.modalRow}>
                <Text>Save as:</Text>
                <TextField
                    placeholder={t('OATHeader.enterAName')}
                    value={projectName}
                    onChange={(e, v) => setProjectName(v)}
                />
            </div>

            <div className={headerStyles.modalRowFlexEnd}>
                <PrimaryButton
                    text={t('OATHeader.save')}
                    onClick={handleOnSave}
                    disabled={!projectName}
                />

                <PrimaryButton
                    text={t('OATHeader.cancel')}
                    onClick={() => setModalOpen(false)}
                />
            </div>
        </Stack>
    );
};

export default FormSaveAs;
