import { ADT3DSceneAdapter, MockAdapter } from '../..';
import { IAzureResource } from '../../Models/Constants/Interfaces';
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
    onContainerUrlChange?: (
        containerUrl: string,
        containerUrls: Array<string>
    ) => void;
} & (WithLocalStorage | WithoutLocalStorage);

export type EnvironmentPickerProps = BaseComponentProps & {
    adapter: ADT3DSceneAdapter | MockAdapter;
    shouldPullFromSubscription?: boolean; // to have this worked with the set value 'true' make sure you pass tenantId and uniqueObjectId to your adapter
    environmentUrl?: string;
    onEnvironmentUrlChange?: (
        environment: string | IAzureResource,
        environments: Array<string | IAzureResource>
    ) => void;
    storage?: StorageContainer;
} & (WithLocalStorage | WithoutLocalStorage);

export type ADTEnvironmentInLocalStorage = {
    name: string;
    config: {
        appAdtUrl: string;
    };
};

export type ADTSelectedEnvironmentInLocalStorage = {
    appAdtUrl: string;
};
