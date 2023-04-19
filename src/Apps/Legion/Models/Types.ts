import { IModelProperty } from './Interfaces';

export type ICookProperty = Pick<IModelProperty, 'name' | 'dataType'>;

export type IReactSelectOption = {
    value: string;
    label: string;
    __isNew__?: boolean;
};
