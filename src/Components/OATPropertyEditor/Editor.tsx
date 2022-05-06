import React, { useState, useRef } from 'react';
import { Theme } from '../../Models/Constants/Enums';
import {
    FontIcon,
    Stack,
    Pivot,
    PivotItem,
    Label,
    Text,
    ActionButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import { DTDLModel } from '../../Models/Classes/DTDL';
import { DTDLProperty } from '../../Models/Constants/Interfaces';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';

interface IEditor {
    currentPropertyIndex?: number;
    model?: DTDLModel;
    templates?: DTDLProperty[];
    theme?: Theme;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setModel?: React.Dispatch<React.SetStateAction<DTDLModel>>;
    setTemplates?: React.Dispatch<React.SetStateAction<DTDLProperty>>;
    templatesActive?: boolean;
    setTemplatesActive?: (active: boolean) => boolean;
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
}

const Editor = ({
    model,
    setModel,
    templates,
    setTemplates,
    theme,
    setModalBody,
    setModalOpen,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    currentPropertyIndex,
    templatesActive,
    setTemplatesActive,
    dispatch
}: IEditor) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [draggingTemplate, setDraggingTemplate] = useState(false);
    const [draggingProperty, setDraggingProperty] = useState(false);
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);

    return (
        <div className={propertyInspectorStyles.container}>
            <Pivot className={propertyInspectorStyles.pivot}>
                <PivotItem
                    headerText={t('OATPropertyEditor.properties')}
                    className={propertyInspectorStyles.pivotItem}
                >
                    <PropertiesModelSummary model={model} setModel={setModel} />
                    <div>
                        <div className={propertyInspectorStyles.paddingWrap}>
                            <Stack
                                className={
                                    propertyInspectorStyles.rowSpaceBetween
                                }
                            >
                                <Label>
                                    {t('OATPropertyEditor.properties')}
                                </Label>
                                <ActionButton
                                    onClick={() => setTemplatesActive(true)}
                                    className={
                                        propertyInspectorStyles.viewTemplatesCta
                                    }
                                >
                                    <FontIcon
                                        className={
                                            propertyInspectorStyles.propertyHeadingIcon
                                        }
                                        iconName={'Library'}
                                    />
                                    <Text>
                                        {t('OATPropertyEditor.viewTemplates')}
                                    </Text>
                                </ActionButton>
                            </Stack>
                        </div>
                        <div
                            className={
                                propertyInspectorStyles.gridRowPropertyHeading
                            }
                        >
                            <Stack className={propertyInspectorStyles.row}>
                                <FontIcon
                                    className={
                                        propertyInspectorStyles.propertyHeadingIcon
                                    }
                                    iconName={'SwitcherStartEnd'}
                                />
                                <Text>{t('OATPropertyEditor.name')}</Text>
                            </Stack>
                            <Stack className={propertyInspectorStyles.row}>
                                <FontIcon
                                    className={
                                        propertyInspectorStyles.propertyHeadingIcon
                                    }
                                    iconName={'SwitcherStartEnd'}
                                />
                                <Text>{t('OATPropertyEditor.schemaType')}</Text>
                            </Stack>
                        </div>
                    </div>

                    <PropertyList
                        propertySelectorVisible={propertySelectorVisible}
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        model={model}
                        setModel={setModel}
                        setCurrentPropertyIndex={setCurrentPropertyIndex}
                        setModalOpen={setModalOpen}
                        currentPropertyIndex={currentPropertyIndex}
                        setTemplates={setTemplates}
                        enteredPropertyRef={enteredPropertyRef}
                        draggingTemplate={draggingTemplate}
                        enteredTemplateRef={enteredTemplateRef}
                        draggingProperty={draggingProperty}
                        setDraggingProperty={setDraggingProperty}
                        setCurrentNestedPropertyIndex={
                            setCurrentNestedPropertyIndex
                        }
                        setModalBody={setModalBody}
                    />
                </PivotItem>
                <PivotItem
                    headerText={t('OATPropertyEditor.json')}
                    className={propertyInspectorStyles.pivotItem}
                >
                    <JSONEditor
                        theme={theme}
                        model={model}
                        setModel={setModel}
                    />
                </PivotItem>
            </Pivot>
            {templatesActive && (
                <TemplateColumn
                    setTemplatesActive={setTemplatesActive}
                    templates={templates}
                    setTemplates={setTemplates}
                    enteredPropertyRef={enteredPropertyRef}
                    model={model}
                    setModel={setModel}
                    draggingTemplate={draggingTemplate}
                    setDraggingTemplate={setDraggingTemplate}
                    draggingProperty={draggingProperty}
                    enteredTemplateRef={enteredTemplateRef}
                    dispatch={dispatch}
                />
            )}
        </div>
    );
};

export default Editor;
