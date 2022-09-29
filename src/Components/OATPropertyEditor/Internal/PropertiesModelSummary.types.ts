import { IAction } from '../../../Models/Constants/Interfaces';

export type PropertiesModelSummaryProps = {
    dispatch: React.Dispatch<React.SetStateAction<IAction>>;
    isSupportedModelType: boolean;
};
