import { FontWeights } from '@fluentui/react';
import { TAnnotationClassNames } from './Annotation.types';
import { makeStyles } from '@fluentui/react-components';
import { shorthands } from '@griffel/react';

export const annotationColorVar = '--legion-diagram-annotation-color';

export const useClassNames = makeStyles<TAnnotationClassNames>({
    root: {
        width: 'fit-content',
        color: `var(${annotationColorVar})`,
        fontWeight: FontWeights.semibold,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'lightgrey',
        opacity: 0.8,
        ...shorthands.padding('4px')
    },
    type: {},
    text: { fontSize: '12px' },
    newIcon: { ...shorthands.padding('4px'), marginTop: '-12px' }
});
