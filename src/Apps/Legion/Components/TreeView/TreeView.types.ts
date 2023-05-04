// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ITreeViewProps {
    sampleData: Asset[];
}

export interface Asset {
    /** Temporary interface for assets. Will be updated */

    /** Display name */
    name: string;
    /** Nested child assets */
    childAssets: Asset[];
}

export type TTreeViewClasses = 'root';
