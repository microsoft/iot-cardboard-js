import { useTheme } from '@fluentui/react';
import React from 'react';
import { Utils } from '../..';
import { ICardboardBasicListItemProps } from './CardboardBasicList.types';
import { getStyles } from './CardboardBasicListItem.styles';

export const CardboardBasicListItem = (props: ICardboardBasicListItemProps) => {
    const { item, index, listKey, textToHighlight } = props;

    const theme = useTheme();
    const classNames = getStyles(theme);
    return (
        <div
            className={classNames.root}
            key={`cardboard-basic-list-item-${listKey}-${index}`}
        >
            <div className={classNames.primaryText} title={item}>
                {textToHighlight
                    ? Utils.getMarkedHtmlBySearch(item, textToHighlight)
                    : item}
            </div>
        </div>
    );
};
