import { PrimaryButton } from '@fluentui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { WidgetFormMode } from '../../../../Models/Constants';
import { BehaviorFormContext } from './BehaviorsForm';

const WidgetForm: React.FC<any> = () => {
    const { widgetFormInfo } = useContext(BehaviorFormContext);
    const { t } = useTranslation();
    return (
        <>
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents"></div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={() => null}
                    text={
                        widgetFormInfo.mode === WidgetFormMode.Create
                            ? t('create')
                            : t('update')
                    }
                    disabled={false}
                />
            </div>
        </>
    );
};

export default WidgetForm;
