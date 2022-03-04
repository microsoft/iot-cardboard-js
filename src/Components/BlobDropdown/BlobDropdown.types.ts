import { IBlobAdapter, MockAdapter } from '../..';
import { BaseComponentProps } from '../BaseComponent/BaseComponent.types';

export type BlobDropdownProps = BaseComponentProps & {
    adapter: IBlobAdapter | MockAdapter;
    fileTypes: Array<string>;
    width?: number | string;
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    onChange?: (blobUrl: string) => void;
    selectedBlobUrl?: string;
};
