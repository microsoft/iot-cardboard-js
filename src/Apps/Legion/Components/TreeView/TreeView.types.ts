export interface ITreeViewProps {
    data: Node[];
}

export interface Node {
    /** Display text */
    text: string;
    /** Nested child nodes */
    children: Node[];
}

export type TTreeViewClasses = 'root';
