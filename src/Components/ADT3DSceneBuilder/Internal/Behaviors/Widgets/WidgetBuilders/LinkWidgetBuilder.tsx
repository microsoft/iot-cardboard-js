// TODO SCHEMA MIGRATION -- update LinkWidgetBuilder to new schema / types
import { TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    intellisenseMultilineBreakpoint,
    linkedTwinName
} from '../../../../../../Models/Constants';
import { Intellisense } from '../../../../../AutoComplete/Intellisense';

import { ILinkWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';

const LinkWidgetBuilder: React.FC<ILinkWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid,
    getIntellisensePropertyNames
}) => {
    const { t } = useTranslation();

    useEffect(() => {
        const { label, linkExpression } = formData.widgetConfiguration;
        if (label && linkExpression) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData]);

    return (
        <>
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
            <Intellisense
                autoCompleteProps={{
                    textFieldProps: {
                        label: t('url'),
                        placeholder: t('widgets.link.urlPlaceholder'),
                        multiline:
                            formData.widgetConfiguration.linkExpression.length >
                            intellisenseMultilineBreakpoint
                    }
                }}
                defaultValue={formData.widgetConfiguration.linkExpression}
                onChange={(newVal) => {
                    updateWidgetData(
                        produce(formData, (draft) => {
                            draft.widgetConfiguration.linkExpression = newVal;
                        })
                    );
                }}
                aliasNames={[linkedTwinName]}
                getPropertyNames={getIntellisensePropertyNames}
            />
        </>
    );
};

export default LinkWidgetBuilder;
