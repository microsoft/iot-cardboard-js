import React from 'react';
import {
    IModelPropertyHeaderProps,
    IModelPropertyHeaderStyleProps,
    IModelPropertyHeaderStyles
} from './ModelPropertyHeader.types';
import { getStyles } from './ModelPropertyHeader.styles';
import {
    classNamesFunction,
    Icon,
    IconButton,
    Stack,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    isDTDLModel,
    isDTDLReference
} from '../../../../Models/Services/DtdlUtils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ModelPropertyHeader', debugLogging);

const getClassNames = classNamesFunction<
    IModelPropertyHeaderStyleProps,
    IModelPropertyHeaderStyles
>();

const ModelPropertyHeader: React.FC<IModelPropertyHeaderProps> = (props) => {
    const {
        entityId,
        entityName,
        entityType,
        onInfoButtonClick,
        styles
    } = props;
    const isModelSelected = isDTDLModel(entityType);
    const isReferenceSelected = isDTDLReference(entityType);

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole(
        'debug',
        'Render. {id, name, type}',
        entityId,
        entityName,
        entityType
    );
    return (
        <Stack horizontal className={classNames.sectionHeaderRoot}>
            {(isReferenceSelected || isModelSelected) && (
                <Icon
                    aria-label={entityType}
                    iconName={
                        isReferenceSelected ? 'Relationship' : 'CubeShape'
                    }
                    className={classNames.sectionHeaderIcon}
                    title={entityType}
                />
            )}
            {isReferenceSelected && (
                <div className={classNames.sectionHeaderContainer}>
                    <h4 className={classNames.sectionTitle} title={entityName}>
                        {entityName}
                    </h4>
                </div>
            )}
            {isModelSelected && (
                <>
                    <Stack
                        tokens={{ childrenGap: 4 }}
                        className={classNames.sectionHeaderContainer}
                    >
                        <h4
                            className={classNames.sectionTitle}
                            title={entityName}
                        >
                            {entityName}
                        </h4>
                        <span
                            className={classNames.sectionSubtitle}
                            title={entityId}
                        >
                            {entityId}
                        </span>
                    </Stack>
                </>
            )}
            {onInfoButtonClick && (
                <IconButton
                    data-testid={'property-editor-details-modal-button'}
                    iconProps={{ iconName: 'info' }}
                    onClick={onInfoButtonClick}
                    styles={classNames.subComponentStyles.modalIconButton?.()}
                    title={t('OATPropertyEditor.details')}
                />
            )}
        </Stack>
    );
};

export default styled<
    IModelPropertyHeaderProps,
    IModelPropertyHeaderStyleProps,
    IModelPropertyHeaderStyles
>(ModelPropertyHeader, getStyles);
