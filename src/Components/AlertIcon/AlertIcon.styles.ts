import { IAlertIconStyleProps, IAlertIconStyles } from './AlertIcon.types';

const classPrefix = 'alert-icon';
const classNames = {
    root: `${classPrefix}-root`
};
export const getStyles = (props: IAlertIconStyleProps): IAlertIconStyles => {
    const { color, theme } = props;
    return {
        root: [
            classNames.root,
            {
                alignItems: 'center',
                backgroundColor: color,
                border: `1px solid ${theme.semanticColors.inputBorder}`,
                borderRadius: '50%',
                display: 'flex',
                height: 28,
                justifyContent: 'center',
                width: 28
            }
        ]
    };
};
