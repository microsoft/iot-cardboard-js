import { TNewIndicatorClassNames } from './NewIndicator.types';
import { makeStyles } from '@fluentui/react-components';

export const useClassNames = makeStyles<TNewIndicatorClassNames>({
    root: {
        width: '12px',
        height: '12px',
        flexShrink: 0,
        paddingLeft: '2px',
        marginTop: '-16px'
    }
});
