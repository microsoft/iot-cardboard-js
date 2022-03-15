import { IColorCellProps } from '@fluentui/react';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export enum Boundary {
    min = 'min',
    max = 'max'
}

export interface IValueRangeBuilderProps {
    valueRanges: IValueRange[];
    setValueRanges: React.Dispatch<React.SetStateAction<IValueRange[]>>;
    customSwatchColors?: IColorCellProps[];
    baseComponentProps?: BaseComponentProps;
}

export interface IValueRangeBuilderContext
    extends Omit<IValueRangeBuilderProps, 'customSwatchColors'> {
    onRangeValueUpdate: (updateParams: OnRangeValueUpdateParams) => void;
    colorSwatch: IColorCellProps[];
    setValueRangeValidationMap: React.Dispatch<
        React.SetStateAction<IValueRangeValidationMap>
    >;
    valueRangeValidationMap: IValueRangeValidationMap;
}

export interface OnRangeValueUpdateParams {
    boundary: Boundary;
    newValue?: any;
    newColor?: string;
    id: string;
}

export interface IValueRangeValidation {
    minValid: boolean;
    maxValid: boolean;
    rangeValid: boolean;
}

export interface IValueRangeValidationMap {
    [id: string]: IValueRangeValidation;
}
