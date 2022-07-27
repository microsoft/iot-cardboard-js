import {
    IADT3DBuilderStyleProps,
    IADT3DBuilderStyles
} from './ADT3DBuilder.types';

export const classPrefix = 'cb-adt-3d-viewer';
const classNames = {
    root: `${classPrefix}-root`,
    wrapper: `${classPrefix}-wrapper`,
    layersPicker: `${classPrefix}-layers-picker`
};
export const getStyles = (
    _props: IADT3DBuilderStyleProps
): IADT3DBuilderStyles => {
    return {
        root: [
            classNames.root,
            {
                height: '100%',
                width: '100%'
            }
        ],
        wrapper: [
            classNames.wrapper,
            {
                height: '100%',
                position: 'relative',
                width: '100%'
            }
        ],
        subComponentStyles: {}
    };
};
