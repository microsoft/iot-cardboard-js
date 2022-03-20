import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '@fluentui/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import { Theme } from '../../Models/Constants/Enums';
import { useLibTheme } from '../../Theming/ThemeProvider';

type OATModelListProps = {
    elements: [];
    theme?: Theme;
    handleElementsUpdate: () => any;
};

const OATModelList = ({
    elements,
    theme,
    handleElementsUpdate
}: OATModelListProps) => {
    const { t } = useTranslation();
    const [models, setModels] = useState(elements);
    const jsonString = JSON.stringify(elements, null, 2);
    const libTheme = useLibTheme();
    const themeToUse = (libTheme || theme) ?? Theme.Light;

    const onNewModel = () => {
        const newModel = {};

        setModels((es) => es.concat(newModel));
    };

    useEffect(() => {
        handleElementsUpdate(models);
    }, [models]);

    useEffect(() => {
        setModels(elements);
    }, [elements]);

    return (
        <BaseComponent theme={themeToUse}>
            <div>
                <ActionButton allowDisabledFocus onClick={onNewModel}>
                    + {t('OATModel.modelUperCase')}
                </ActionButton>
                <br />
                <label>{jsonString}</label>
            </div>
        </BaseComponent>
    );
};

export default OATModelList;
