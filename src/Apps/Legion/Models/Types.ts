import { IADXConnection, IPIDDocument } from './Interfaces';
import { IDbProperty } from './Wizard.types';

export type ICookProperty = Pick<IDbProperty, 'sourcePropName'> & {
    lastKnownValue: any;
};

export type ICookSource = IADXConnection | IPIDDocument;

/** type definition for an option provided to a React-select component */
export type IReactSelectOption = {
    value: string;
    label: string;
    __isNew__?: boolean;
};
