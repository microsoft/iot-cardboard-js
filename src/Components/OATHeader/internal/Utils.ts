import { OATFilesStorageKey } from '../../../Models/Constants';
import { ProjectData } from './Classes';

/* Load files from local storage */
export const loadFiles = () =>
    JSON.parse(localStorage.getItem(OATFilesStorageKey));

/* Save files from local storage */
export const saveFiles = (files: ProjectData[]) => {
    localStorage.setItem(OATFilesStorageKey, JSON.stringify(files));
};
