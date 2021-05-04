import { Action } from '../../../Models/Constants/Interfaces';
import produce from 'immer';
import { BIMViewerCardCreateState } from './BIMViewerCardCreate.types';

export const defaultBIMViewerCardCreateState: BIMViewerCardCreateState = {};

// Using immer immutability helper: https://github.com/immerjs/immer
export const BIMViewerCardCreateReducer = produce(
    (draft: BIMViewerCardCreateState, action: Action) => {
        switch (action.type) {
            default:
                return;
        }
    },
    defaultBIMViewerCardCreateState
);
