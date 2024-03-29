import React from 'react';
import {
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
} from './PropertyListItemMapChild.types';
import { getStyles } from './PropertyListItemMapChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';
import { deepCopy } from '../../../../../../../../../../Models/Services/Utils';
import { useTranslation } from 'react-i18next';
import PropertyIcon from '../../../PropertyIcon/PropertyIcon';

const getClassNames = classNamesFunction<
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>();

const LOC_KEYS = {
    mapKeyIconTitle: 'OAT.PropertyEditor.PropertyList.mapKeyName'
};

const PropertyListItemMapChild: React.FC<IPropertyListItemMapChildProps> = (
    props
) => {
    const {
        item,
        indexKey,
        level,
        onUpdateKey,
        onUpdateValue,
        parentModelContext,
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
                indexKey={`${indexKey}.0`}
                item={item.mapKey}
                level={level + 1}
                isFirstItem={true}
                isLastItem={true}
                onCopy={undefined}
                onRemove={undefined}
                onReorderItem={undefined}
                onUpdateName={(args) => {
                    const keyCopy = deepCopy(item.mapKey);
                    keyCopy.name = args.name;
                    onUpdateKey(keyCopy);
                }}
                onUpdateSchema={undefined} // not allowed to change, always string
                optionHideMenu={true}
                optionRenderCustomMenuIcon={() => (
                    <PropertyIcon
                        schema={undefined}
                        overrideIcon={{
                            name: 'Permissions',
                            title: t(LOC_KEYS.mapKeyIconTitle)
                        }}
                    />
                )}
                parentModelContext={parentModelContext}
            />
            <PropertyListItem
                indexKey={`${indexKey}.0`}
                item={item.mapValue}
                level={level + 1}
                isFirstItem={true}
                isLastItem={true}
                onCopy={undefined}
                onRemove={undefined}
                onReorderItem={undefined}
                onUpdateName={(args) => {
                    const valueCopy = deepCopy(item.mapValue);
                    valueCopy.name = args.name;
                    onUpdateValue(valueCopy);
                }}
                onUpdateSchema={(args) => {
                    const keyCopy = deepCopy(item.mapValue);
                    keyCopy.schema = args;
                    onUpdateValue(keyCopy);
                }}
                parentModelContext={parentModelContext}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>(PropertyListItemMapChild, getStyles);
