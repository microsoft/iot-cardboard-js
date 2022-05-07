import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getMapItemStyles,
    getPropertyEditorTextFieldStyles,
    getListMapItemTextStyles
} from './OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import { UPDATE_OAT_PROPERTY_EDITOR_MODEL } from '../../Models/Constants/ActionTypes';

type IEnumItem = {
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
    index?: number;
    item?: any;
    state?: any;
};

export const PropertyListMapItemNested = ({
    dispatch,
    item,
    index,
    state
}: IEnumItem) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const mapItemStyles = getMapItemStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const textStyles = getListMapItemTextStyles();

    const updateMapKeyName = (value) => {
        const modelCopy = Object.assign({}, state.model);
        modelCopy.contents[index].schema.mapKey.name = value;
        dispatch({
            type: UPDATE_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    const updateMapValueName = (value) => {
        const modelCopy = Object.assign({}, state.model);
        modelCopy.contents[index].schema.mapValue.name = value;
        dispatch({
            type: UPDATE_OAT_PROPERTY_EDITOR_MODEL,
            payload: modelCopy
        });
    };

    return (
        <>
            <Stack styles={mapItemStyles} tabIndex={0}>
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
            <Stack styles={mapItemStyles} tabIndex={0}>
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
        </>
    );
};

export default PropertyListMapItemNested;
