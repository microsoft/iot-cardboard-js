import { MockAdapter } from '../..';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

type WithLocalStorage = {
    isLocalStorageEnabled: true;
    localStorageKey: string;
};

type WithoutLocalStorage = {
    isLocalStorageEnabled: false;
    localStorageKey?: never;
};

type StorageContainer = {
    containerUrl?: string;
    onContainerUrlChange?: (newContainerUrl: string) => void;
} & (WithLocalStorage | WithoutLocalStorage);

export type EnvironmentPickerProps = BaseComponentProps & {
    adapter: IADTAdapter | MockAdapter;
    shouldPullFromSubscription?: boolean;
    environmentUrl?: string;
    onEnvironmentUrlChange?: (newEnvironmentUrl: string) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);
