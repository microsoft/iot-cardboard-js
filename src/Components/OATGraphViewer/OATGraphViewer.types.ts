import { SimulationNodeDatum } from 'd3-force';
import { ElementNode } from './Internal/Classes/ElementNode';

export type IOatGraphNode = SimulationNodeDatum & {
    id: string;
};

export type IOatElementNode = ElementNode & {
    source: string;
    target: string;
};
