import React, { useMemo } from 'react';
import {
    IEditorJsonTabProps,
    IEditorJsonTabStyleProps,
    IEditorJsonTabStyles
} from './EditorJsonTab.types';
import { getStyles } from './EditorJsonTab.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import {
    isDTDLModel,
    isDTDLRelationshipReference
} from '../../../../Models/Services/DtdlUtils';
import JSONEditor from '../JSONEditor/JSONEditor';

const getClassNames = classNamesFunction<
    IEditorJsonTabStyleProps,
    IEditorJsonTabStyles
>();

const EditorJsonTab: React.FC<IEditorJsonTabProps> = (props) => {
    const { selectedItem, selectedThemeName, styles } = props;

    const isSupportedModelType = useMemo(
        () =>
            isDTDLModel(selectedItem) ||
            isDTDLRelationshipReference(selectedItem),
        [selectedItem]
    );

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            {isSupportedModelType && (
                <JSONEditor selectedTheme={selectedThemeName} />
            )}
        </div>
    );
};

export default styled<
    IEditorJsonTabProps,
    IEditorJsonTabStyleProps,
    IEditorJsonTabStyles
>(EditorJsonTab, getStyles);
