import React from 'react';
import {
    IPropertyListItemArrayChildProps,
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
} from './PropertyListItemArrayChild.types';
import { getStyles } from './PropertyListItemArrayChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
>();

const PropertyListItemArrayChild: React.FC<IPropertyListItemArrayChildProps> = (
    props
) => {
    const {
        parentModelContext,
        indexKey,
        item,
        level,
        onUpdateSchema,
        styles
    } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <PropertyListItem
                parentModelContext={parentModelContext}
                indexKey={indexKey}
                level={level + 1}
                item={{
                    name: t(
                        'OATPropertyEditor.PropertyListItem.arrayItemLabel'
                    ),
                    schema: item
                }}
                optionDisableInput={true}
                onCopy={undefined}
                onReorderItem={undefined}
                onUpdateName={undefined}
                onUpdateSchema={onUpdateSchema}
                onRemove={undefined}
                isFirstItem={true}
                isLastItem={true}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemArrayChildProps,
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
>(PropertyListItemArrayChild, getStyles);
