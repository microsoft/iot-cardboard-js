import React, { useMemo } from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import {
    getPropertyInspectorStyles,
    getMapItemStyles,
    getPropertyEditorTextFieldStyles,
    getListMapItemTextStyles
} from '../OATPropertyEditor.styles';
import { useTranslation } from 'react-i18next';
import { deepCopy } from '../../../Models/Services/Utils';
import {
    getModelPropertyCollectionName,
    getTargetFromSelection
} from '../Utils';
import { PropertyListMapItemNestedProps } from './PropertyListMapItemNested.types';
import { useOatPageContext } from '../../../Models/Context/OatPageContext/OatPageContext';
import { OatPageContextActionType } from '../../../Models/Context/OatPageContext/OatPageContext.types';

export const PropertyListMapItemNested: React.FC<PropertyListMapItemNestedProps> = (
    props
) => {
    const { item, index } = props;

    // hooks
    const { t } = useTranslation();

    // contexts
    const { oatPageDispatch, oatPageState } = useOatPageContext();

    // data
    const model = useMemo(
        () =>
            oatPageState.selection &&
            getTargetFromSelection(
                oatPageState.currentOntologyModels,
                oatPageState.selection
            ),
        [oatPageState.currentOntologyModels, oatPageState.selection]
    );

    const propertiesKeyName = getModelPropertyCollectionName(
        model ? model['@type'] : ''
    );

    // callbacks
    const updateMapKeyName = (value: string) => {
        const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
        const modelCopy = getTargetFromSelection(
            modelsCopy,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oatPageState.selection!
        );
        if (!modelCopy) {
            return;
        }
        modelCopy[propertiesKeyName][index].schema.mapKey.name = value;
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_MODELS,
            payload: { models: modelsCopy }
        });
    };

    const updateMapValueName = (value: string) => {
        const modelsCopy = deepCopy(oatPageState.currentOntologyModels);
        const modelCopy = getTargetFromSelection(
            modelsCopy,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            oatPageState.selection!
        );
        if (!modelCopy) {
            return;
        }
        modelCopy[propertiesKeyName][index].schema.mapValue.name = value;
        oatPageDispatch({
            type: OatPageContextActionType.SET_CURRENT_MODELS,
            payload: { models: modelsCopy }
        });
    };

    // styles
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const mapItemStyles = getMapItemStyles();
    const textFieldStyles = getPropertyEditorTextFieldStyles();
    const textStyles = getListMapItemTextStyles();

    return (
        <div className={propertyInspectorStyles.mapItemWrap}>
            <Stack styles={mapItemStyles}>
                <Text styles={textStyles}>{t('OATPropertyEditor.key')}</Text>
                <div className={propertyInspectorStyles.mapItemInputWrap}>
                    <TextField
                        styles={textFieldStyles}
                        borderless
                        placeholder={item.schema.mapKey.name}
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        onChange={(_ev, value) => updateMapKeyName(value!)}
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
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        onChange={(_ev, value) => updateMapValueName(value!)}
                    />
                    <Text>{item.schema.mapValue.schema}</Text>
                </div>
            </Stack>
        </div>
    );
};

export default PropertyListMapItemNested;
