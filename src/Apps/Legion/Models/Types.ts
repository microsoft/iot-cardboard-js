import { IDataPusherContext } from '../Components/DataPusher/DataPusher.types';
import { IWizardDataManagementContext } from '../Contexts/WizardDataManagementContext/WizardDataManagementContext.types';
import { IModelProperty } from './Interfaces';

export type ICookProperty = Pick<IModelProperty, 'name' | 'dataType'>;

export type IReactSelectOption = {
    value: string;
    label: string;
    __isNew__?: boolean;
};

export type ADXAdapterTargetContext =
    | IWizardDataManagementContext
    | IDataPusherContext;
