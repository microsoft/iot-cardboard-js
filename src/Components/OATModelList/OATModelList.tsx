import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton, List } from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';

import './OATModelList.scss';

type OATModelListProps = {
    elements: [];
    theme?: Theme;
    onHandleElementsUpdate: () => any;
};

const OATModelList = ({
    elements,
    theme,
    onHandleElementsUpdate
}: OATModelListProps) => {
    const { t } = useTranslation();
    const [models, setModels] = useState(elements);
    const [items, setItems] = useState(models.digitalTwinsModels);
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;

    const onNewModel = () => {
        const newModel = {};

        setModels((es) => es.concat(newModel));
    };

    useEffect(() => {
        onHandleElementsUpdate(models);
    }, [models]);

    useEffect(() => {
        setModels(elements);
    }, [elements]);

    const onRenderCell = (item) => {
        return (
            <div data-is-focusable={true}>
                <div className="cb-ontology-model-list">
                    <div>{item['displayName']}</div>
                    <div>{item['@id']}</div>
                </div>
            </div>
        );
    };

    return (
        <BaseComponent theme={themeToUse}>
            <div>
                <ActionButton allowDisabledFocus onClick={onNewModel}>
                    + {t('OATModel.model')}
                </ActionButton>
                <br />
                <List
                    items={models.digitalTwinsModels}
                    onRenderCell={onRenderCell}
                />
            </div>
        </BaseComponent>
    );
};

export default OATModelList;
