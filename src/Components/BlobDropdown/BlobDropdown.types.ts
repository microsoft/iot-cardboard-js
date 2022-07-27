import { IBlobAdapter, IStorageBlob, MockAdapter } from '../..';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export type BlobDropdownProps = BaseComponentProps & {
    adapter: IBlobAdapter | MockAdapter;
    fileTypes: Array<string>;
    width?: number | string;
    hasLabel?: boolean;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    onChange?: (blobUrl: string) => void;
    onLoad?: (blobs: Array<IStorageBlob>) => void;
    selectedBlobUrl?: string;
};
