import {
    ITutorialModalStyleProps,
    ITutorialModalStyles
} from './TutorialModal.types';

export const classPrefix = 'cb-tutorialmodal';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (
    _props: ITutorialModalStyleProps
): ITutorialModalStyles => {
    return {
        root: [classNames.root],
        subComponentStyles: {}
    };
};
