import React, { useCallback } from 'react';
import {
    IPropertyListItemChildHostProps,
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
} from './PropertyListItemChildHost.types';
import { getStyles } from './PropertyListItemChildHost.styles';
import { classNamesFunction, List, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../Models/Hooks/useExtendedTheme';
import {
    isDTDLArray,
    isDTDLEnum,
    isDTDLMap,
    isDTDLObject
} from '../../../../../../../../Models/Services/DtdlUtils';
import PropertyListItemEnumChild from './Internal/PropertyListItemEnumChild/PropertyListItemEnumChild';

const getClassNames = classNamesFunction<
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
>();

const PropertyListItemChildHost: React.FC<IPropertyListItemChildHostProps> = (
    props
) => {
    const { propertyItem, styles } = props;

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
            {isDTDLEnum(propertyItem) ? (
                <>
                    <List
                        items={propertyItem.schema.enumValues}
                        onRenderCell={(item) => (
                            <PropertyListItemEnumChild
                                item={item}
                                enumType={propertyItem.schema.valueSchema}
                            />
                        )}
                    />
                </>
            ) : isDTDLArray(propertyItem) ? (
                <>Array</>
            ) : isDTDLMap(propertyItem) ? (
                <>Map</>
            ) : isDTDLObject(propertyItem) ? (
                <>Object</>
            ) : (
                <div>unknown</div>
            )}
        </div>
    );
};

export default styled<
    IPropertyListItemChildHostProps,
    IPropertyListItemChildHostStyleProps,
    IPropertyListItemChildHostStyles
>(PropertyListItemChildHost, getStyles);
