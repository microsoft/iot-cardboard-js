import { IViewEntity } from '../../Models';

export interface IDiagramProps {
    parentRef: React.MutableRefObject<HTMLDivElement>;
    imageUrl: string;
    annotations: Array<TDiagramAnnotation>;
}

export type TDiagramAnnotation = Pick<
    IViewEntity,
    'friendlyName' | 'isNew' | 'values' | 'type'
>;

export type TDiagramAnnotationPlacement = TDiagramAnnotation & {
    left: string;
    top: string;
};

export type TDiagramClassNames =
    | 'root'
    | 'spinnerWrapper'
    | 'annotationWrapper';
