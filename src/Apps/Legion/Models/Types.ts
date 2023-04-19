import { IDataManagementAdapter } from '../Adapters/Standalone/DataManagement/Models/DataManagementAdapter.types';
import { IModelProperty } from './Interfaces';

export type ICookProperty = Pick<IModelProperty, 'name' | 'dataType'>;

/** type definition for an option provided to a React-select component */
export type IReactSelectOption = {
    value: string;
    label: string;
    __isNew__?: boolean;
};

/** type definition for target context parameter for useADXAdapter hook */
export type ADXAdapterTargetContext = React.Context<
    {
        adapter: IDataManagementAdapter;
    } & unknown
>;
