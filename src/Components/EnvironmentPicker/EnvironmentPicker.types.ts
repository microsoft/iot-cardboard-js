import { ADT3DSceneAdapter, MockAdapter } from '../..';
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
    isDialogHidden?: boolean;
    onDismiss?: () => void;
    environmentUrl?: string;
    onEnvironmentUrlChange?: (
        environment: string,
        environments: Array<string>
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

export type StorageAccountsInLocalStorage = {
    id: string;
    url: string;
};

export type StorageAccountToContainersMapping = {
    storageAccountId: string;
    storageAccountUrl: string;
    containerNames: Array<string>;
};
