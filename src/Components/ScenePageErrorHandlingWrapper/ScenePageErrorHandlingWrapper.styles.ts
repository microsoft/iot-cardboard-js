import {
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    Theme
} from '@fluentui/react';

const classPrefix = 'cb-scene-page-error-handling-wrapper';

const classNames = {
    root: `${classPrefix}-root`,
    warningMessage: `${classPrefix}-warning-message`,
    progressMessage: `${classPrefix}-progress-message`,
    list: `${classPrefix}-list-items`,
    alternatedSuffix: `${classPrefix}-alternated-suffix`
};

export const getScenePageErrorHandlingStyles = memoizeFunction(
    (theme: Theme) => {
        return mergeStyleSets({
            root: [
                classNames.root,
                {
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                } as IStyle
            ],
            warningMessage: [
                classNames.warningMessage,
                { marginTop: 14 } as IStyle
            ],
            progressMessage: [
                classNames.progressMessage,
                {
                    textAlign: 'center',
                    fontSize: 12,
                    height: 120,
                    paddingBottom: 40,
                    margin: '0 auto',
                    width: '50%'
                } as IStyle
            ],
            list: [
                classNames.list,
                { listStyleType: 'none', padding: 0 } as IStyle
            ],
            alternatedSuffix: [
                classNames.alternatedSuffix,
                { color: theme.palette.themeDark } as IStyle
            ]
        });
    }
);
