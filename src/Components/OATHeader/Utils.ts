import { useTranslation } from 'react-i18next';
import { OATDataStorageKey } from '../../Models/Constants/Constants';
import {
    SET_OAT_PROJECT_NAME,
    SET_OAT_PROPERTY_EDITOR_MODEL,
    SET_OAT_RELOAD_PROJECT
} from '../../Models/Constants/ActionTypes';
import { IAction } from '../../Models/Constants/Interfaces';

/* Reset Project*/
export const resetProject = (
    dispatch: React.Dispatch<React.SetStateAction<IAction>>
) => {
    const { t } = useTranslation();
    const clearProject = {
        modelPositions: [],
        models: [],
        projectDescription: t('OATHeader.description'),
        projectName: t('OATHeader.project')
    };

    localStorage.setItem(OATDataStorageKey, JSON.stringify(clearProject));

    dispatch({
        type: SET_OAT_PROPERTY_EDITOR_MODEL,
        payload: clearProject
    });

    dispatch({
        type: SET_OAT_PROJECT_NAME,
        payload: t('OATHeader.project')
    });

    dispatch({
        type: SET_OAT_RELOAD_PROJECT,
        payload: true
    });
};
