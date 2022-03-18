import { IColorCellProps } from '@fluentui/react';
import { IValueRange } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export enum Boundary {
    min = 'min',
    max = 'max'
}

export enum ValueRangeBuilderActionType {
    SET_VALUE_RANGES,
    ADD_VALUE_RANGE,
    UPDATE_VALUE_RANGE,
    DELETE_VALUE_RANGE,
    UPDATE_VALIDATION_MAP,
    UPDATE_VALUE_RANGE_VALIDATION,
    SNAP_VALUE_TO_INFINITY,
    PRE_FILL_VALUE_RANGES_TO_MIN_REQUIRED
}

export type ValueRangeBuilderAction =
    | {
          type: ValueRangeBuilderActionType.ADD_VALUE_RANGE;
          payload: {
              id: string;
              color: string;
          };
      }
    | {
          type: ValueRangeBuilderActionType.PRE_FILL_VALUE_RANGES_TO_MIN_REQUIRED;
      }
    | {
          type: ValueRangeBuilderActionType.UPDATE_VALUE_RANGE;
          payload: {
              boundary: Boundary;
              id: string;
              newValue?: string;
              newColor?: string;
          };
      }
    | {
          type: ValueRangeBuilderActionType.DELETE_VALUE_RANGE;
          payload: {
              id: string;
          };
      }
    | {
          type: ValueRangeBuilderActionType.UPDATE_VALUE_RANGE_VALIDATION;
          payload: {
              newValue: string;
              currentValueRange: IValueRange;
              isMin: boolean;
          };
      }
    | {
          type: ValueRangeBuilderActionType.SNAP_VALUE_TO_INFINITY;
          payload: {
              newValue: string;
              currentValueRange: IValueRange;
              boundary: Boundary;
          };
      };

export interface IValueRangeBuilderState {
    valueRanges: IValueRange[];
    validationMap: IValueRangeValidationMap;
    colorSwatch: IColorCellProps[];
    minRanges: number;
    maxRanges: number;
}

export interface IValueRangeBuilderAction {
    type: string;
    payload?: any;
}

export interface IValueRangeBuilderProps {
    initialValueRanges: IValueRange[];
    customSwatchColors?: IColorCellProps[];
    baseComponentProps?: BaseComponentProps;
    setAreRangesValid?: React.Dispatch<React.SetStateAction<boolean>>;
    minRanges?: number;
    maxRanges?: number;
}

export interface IValueRangeBuilderContext {
    state: IValueRangeBuilderState;
    dispatch: React.Dispatch<ValueRangeBuilderAction>;
}

export interface IValueRangeValidation {
    minValid: boolean;
    maxValid: boolean;
    rangeValid: boolean;
}

export interface IValueRangeOverlap {
    source: string;
    pair: string;
}

export interface IValueRangeValidationMap {
    overlapFound: boolean;
    validation: {
        [id: string]: IValueRangeValidation;
    };
}

export interface IValueRangeBuilderHandle {
    getValueRanges: () => IValueRange[];
}
