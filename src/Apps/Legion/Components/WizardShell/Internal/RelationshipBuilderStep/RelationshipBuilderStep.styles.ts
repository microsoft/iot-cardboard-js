import {
    IRelationshipBuilderStepStyleProps,
    IRelationshipBuilderStepStyles
} from './RelationshipBuilderStep.types';
import { CardboardClassNamePrefix } from '../../../../../../Models/Constants';

const classPrefix = `${CardboardClassNamePrefix}-relationshipbuilderstep`;
const classNames = {
    root: `${classPrefix}-root`
};

// export const RELATIONSHIPBUILDERSTEP_CLASS_NAMES = classNames;
export const getStyles = (
    _props: IRelationshipBuilderStepStyleProps
): IRelationshipBuilderStepStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
