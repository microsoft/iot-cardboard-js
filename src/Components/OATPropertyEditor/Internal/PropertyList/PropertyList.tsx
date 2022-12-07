import React from 'react';
import {
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
} from './PropertyList.types';
import { getStyles } from './PropertyList.styles';
import {
    classNamesFunction,
    FocusZone,
    FocusZoneDirection,
    List,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from './Internal/PropertyListItem/PropertyListItem';
import { DTDLSchema } from '../../../../Models/Classes/DTDL';
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('PropertyList', debugLogging);

const getClassNames = classNamesFunction<
    IPropertyListStyleProps,
    IPropertyListStyles
>();

const PropertyList: React.FC<IPropertyListProps> = (props) => {
    const { properties, styles } = props;

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
            <FocusZone direction={FocusZoneDirection.vertical}>
                <List
                    items={properties}
                    onRenderCell={(item, index) => {
                        const onUpdateItem = (schema: DTDLSchema) => {
                            logDebugConsole(
                                'info',
                                'Updating item with data. {item,data}',
                                item,
                                schema
                            );
                        };
                        return (
                            <PropertyListItem
                                indexKey={String(index)}
                                item={item}
                                onUpdateItem={onUpdateItem}
                            />
                        );
                    }}
                />
            </FocusZone>
        </div>
    );
};

export default styled<
    IPropertyListProps,
    IPropertyListStyleProps,
    IPropertyListStyles
>(PropertyList, getStyles);
