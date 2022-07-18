import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getMapItemStyles,
    getPropertyEditorTextFieldStyles,
    getListMapItemTextStyles
} from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import { SET_OAT_SELECTED_MODEL } from '../../Models/Constants/ActionTypes';
import { deepCopy } from '../../Models/Services/Utils';
import { getModelPropertyCollectionName } from './Utils';
import { PropertyListMapItemNestedProps } from './PropertyListMapItemNested.types';

export const PropertyListMapItemNested = ({
    dispatch,
    item,
    index,
    state
}: PropertyListMapItemNestedProps) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const mapItemStyles = getMapItemStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const textStyles = getListMapItemTextStyles();
    const { model } = state;

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : null
    );

    const updateMapKeyName = (value: string) => {
        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][index].schema.mapKey.name = value;
        dispatch({
            type: SET_OAT_SELECTED_MODEL,
            payload: modelCopy
        });
    };

    const updateMapValueName = (value: string) => {
        const modelCopy = deepCopy(model);
        modelCopy[propertiesKeyName][index].schema.mapValue.name = value;
        dispatch({
            type: SET_OAT_SELECTED_MODEL,
            payload: modelCopy
        });
    };

    return (
        <div className={propertyInspectorStyles.mapItemWrap}>
            <Stack styles={mapItemStyles}>
                <Text styles={textStyles}>{t('OATPropertyEditor.key')}</Text>
                <div className={propertyInspectorStyles.mapItemInputWrap}>
                    <TextField
                        styles={textFieldStyles}
                        borderless
                        placeholder={item.schema.mapKey.name}
                        onChange={(_ev, value) => updateMapKeyName(value)}
                    />
                    <Text>{item.schema.mapKey.schema}</Text>
                </div>
            </Stack>
            <Stack styles={mapItemStyles}>
                <Text styles={textStyles}>{t('OATPropertyEditor.value')}</Text>
                <div className={propertyInspectorStyles.mapItemInputWrap}>
                    <TextField
                        styles={textFieldStyles}
                        borderless
                        placeholder={item.schema.mapValue.name}
                        onChange={(_ev, value) => updateMapValueName(value)}
                    />
                    <Text>{item.schema.mapValue.schema}</Text>
                </div>
            </Stack>
        </div>
    );
};

export default PropertyListMapItemNested;
