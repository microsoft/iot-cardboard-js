import { IADXConnection, IModelProperty, IPIDDocument } from './Interfaces';

export type ICookProperty = Pick<IModelProperty, 'name' | 'dataType'>;

export type ICookSource = IADXConnection | IPIDDocument;

/** type definition for an option provided to a React-select component */
export type IReactSelectOption = {
    value: string;
    label: string;
    __isNew__?: boolean;
};
