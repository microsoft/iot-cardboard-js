// TODO SCHEMA MIGRATION -- update LinkWidgetBuilder to new schema / types
import { Stack, TextField, useTheme } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    addTemplateStringsToText,
    stripTemplateStringsFromText
} from '../../../../../../Models/Services/Utils';
import ModelledPropertyBuilder from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import { PropertyExpression } from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';
import { ILinkWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import { getWidgetFormStyles } from '../WidgetForm/WidgetForm.styles';

const LinkWidgetBuilder: React.FC<ILinkWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();

    const {
        behaviorToEdit,
        adapter,
        config,
        sceneId,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);

    const onExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.linkExpression = addTemplateStringsToText(
                        newPropertyExpression.expression
                    );
                })
            );
        },
        [formData, updateWidgetData]
    );

    useEffect(() => {
        const { label, linkExpression } = formData.widgetConfiguration;
        if (label && linkExpression) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData, setIsWidgetConfigValid]);

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);

    return (
        <div className={customStyles.widgetFormContents}>
            <Stack tokens={{ childrenGap: 8 }}>
                <TextField
                    label={t('label')}
                    value={formData.widgetConfiguration.label}
                    onChange={(_ev, newVal) =>
                        updateWidgetData(
                            produce(formData, (draft) => {
                                draft.widgetConfiguration.label = newVal;
                            })
                        )
                    }
                />
                <ModelledPropertyBuilder
                    adapter={adapter}
                    twinIdParams={{
                        behavior: behaviorToEdit,
                        config,
                        sceneId,
                        selectedElements
                    }}
                    mode="INTELLISENSE"
                    propertyExpression={{
                        expression:
                            stripTemplateStringsFromText(
                                formData.widgetConfiguration.linkExpression
                            ) || ''
                    }}
                    onChange={onExpressionChange}
                    required
                    intellisensePlaceholder={t('widgets.link.urlPlaceholder')}
                    customLabel={t('url')}
                />
            </Stack>
        </div>
    );
};

export default LinkWidgetBuilder;
