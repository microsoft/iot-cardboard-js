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
import { DTDLProperty } from '../../Models/Constants/Interfaces';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';

interface IEditor {
    currentPropertyIndex?: number;
    dispatch?: React.Dispatch<React.SetStateAction<any>>;
    templates?: DTDLProperty[];
    theme?: Theme;
    setCurrentNestedPropertyIndex?: React.Dispatch<
        React.SetStateAction<number>
    >;
    setCurrentPropertyIndex?: React.Dispatch<React.SetStateAction<number>>;
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    setModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setTemplates?: React.Dispatch<React.SetStateAction<DTDLProperty>>;
    templatesActive?: boolean;
    setTemplatesActive?: React.Dispatch<React.SetStateAction<boolean>>;
    state: any;
}

const Editor = ({
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
    dispatch,
    state
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
                    <PropertiesModelSummary dispatch={dispatch} state={state} />
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
                        dispatch={dispatch}
                        state={state}
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
                        dispatch={dispatch}
                        state={state}
                    />
                </PivotItem>
            </Pivot>
            {templatesActive && (
                <TemplateColumn
                    setTemplatesActive={setTemplatesActive}
                    templates={templates}
                    setTemplates={setTemplates}
                    enteredPropertyRef={enteredPropertyRef}
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
