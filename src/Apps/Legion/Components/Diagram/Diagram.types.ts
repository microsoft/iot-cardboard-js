import { IViewEntity } from '../../Models';

export interface IDiagramProps {
    imageUrl: string;
    annotations: Array<IDiagramAnnotations>;
}

export type IDiagramAnnotations = Pick<
    IViewEntity,
    'friendlyName' | 'isNew' | 'values' | 'type'
>;

export type TDiagramClassNames = 'root' | 'annotationWrapper';
