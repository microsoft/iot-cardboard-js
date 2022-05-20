import { IStyle, memoizeFunction, mergeStyleSets } from '@fluentui/react';

const classPrefix = 'cb-scene-page-error-handling-wrapper';

const classNames = {
    root: `${classPrefix}-root`,
    warningMessage: `${classPrefix}-warning-message`,
    progressContainer: `${classPrefix}-progress-container`,
    progressMessage: `${classPrefix}-progress-message`
};

export const getScenePageErrorHandlingStyles = memoizeFunction(() => {
    return mergeStyleSets({
        root: [
            classNames.root,
            {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            } as IStyle
        ],
        warningMessage: [
            classNames.warningMessage,
            { marginTop: 14 } as IStyle
        ],
        progressContainer: [
            classNames.progressContainer,
            {
                width: 420,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            } as IStyle
        ],
        progressMessage: [
            classNames.progressMessage,
            {
                textAlign: 'center',
                fontSize: 12,
                padding: '24px 0px 4px'
            } as IStyle
        ]
    });
});
