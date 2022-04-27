import React, { useState } from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Text
} from '@fluentui/react';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import PropertyListItemSubMenu from './PropertyListItemSubMenu';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { deepCopy } from '../../Models/Services/Utils';

type IPropertyListItemNested = {
    deleteNestedItem?: (parentIndex: number, index: number) => any;
    getItemClassName?: (index: number) => any;
    getErrorMessage?: (value: string) => string;
    index?: number;
    item?: any;
    model?: DTDLModel;
    parentIndex?: number;
    setCurrentNestedPropertyIndex: React.Dispatch<React.SetStateAction<number>>;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setTemplates?: React.Dispatch<React.SetStateAction<any>>;
};

export const PropertyListItemNested = ({
    deleteNestedItem,
    getErrorMessage,
    getItemClassName,
    index,
    item,
    parentIndex,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    setModalOpen,
    setTemplates,
    setModel,
    model
}: IPropertyListItemNested) => {
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [subMenuActive, setSubMenuActive] = useState(false);

    const handleDuplicate = () => {
        const itemCopy = deepCopy(item);
        itemCopy.name = `${itemCopy.name}_copy`;
        itemCopy.displayName = `${itemCopy.displayName}_copy`;
        itemCopy['@id'] = `${itemCopy['@id']}_copy`;

        const modelCopy = deepCopy(model);
        modelCopy.contents[parentIndex].schema.fields.push(itemCopy);
        setModel(modelCopy);
    };

    const handleTemplateAddition = () => {
        setTemplates((templates) => [...templates, item]);
    };

    return (
        <Stack className={getItemClassName(index)} tabIndex={0}>
            <TextField
                className={propertyInspectorStyles.propertyItemTextField}
                borderless
                placeholder={item.name}
                validateOnFocusOut
                onChange={() => {
                    setCurrentPropertyIndex(parentIndex);
                }}
                onGetErrorMessage={getErrorMessage}
            />
            <Text>{item.schema}</Text>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrap}
                onClick={() => {
                    setCurrentNestedPropertyIndex(index);
                    setCurrentPropertyIndex(parentIndex);
                    setModalOpen(true);
                }}
            >
                <FontIcon
                    iconName={'Info'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
            </ActionButton>
            <ActionButton
                className={propertyInspectorStyles.propertyItemIconWrapMore}
                onClick={() => setSubMenuActive(!subMenuActive)}
            >
                <FontIcon
                    iconName={'More'}
                    className={propertyInspectorStyles.propertyItemIcon}
                />
                {subMenuActive && (
                    <PropertyListItemSubMenu
                        deleteNestedItem={deleteNestedItem}
                        index={index}
                        parentIndex={parentIndex}
                        subMenuActive={subMenuActive}
                        handleTemplateAddition={() => {
                            handleTemplateAddition();
                        }}
                        handleDuplicate={() => {
                            handleDuplicate();
                        }}
                    />
                )}
            </ActionButton>
        </Stack>
    );
};

export default PropertyListItemNested;
