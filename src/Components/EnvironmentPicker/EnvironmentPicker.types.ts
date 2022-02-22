import { MockAdapter } from '../..';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

type WithLocalStorage = {
    isLocalStorageEnabled: true;
    localStorageKey: string;
    selectedItemLocalStorageKey: string;
};

type WithoutLocalStorage = {
    isLocalStorageEnabled: false;
    localStorageKey?: never;
    selectedItemLocalStorageKey?: never;
};

type StorageContainer = {
    containerUrl?: string;
    onContainerUrlChange?: (containerUrl: string) => void;
} & (WithLocalStorage | WithoutLocalStorage);

export type EnvironmentPickerProps = BaseComponentProps & {
    adapter: IADTAdapter | MockAdapter;
    shouldPullFromSubscription?: boolean;
    environmentUrl?: string;
    onEnvironmentUrlChange?: (newEnvironmentUrl: string) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);
