import { TNewIndicatorClassNames } from './NewIndicator.types';
import { makeStyles } from '@fluentui/react-components';

export const useClassNames = makeStyles<TNewIndicatorClassNames>({
    root: {
        paddingLeft: '2px',
        marginTop: '-16px'
    }
});
