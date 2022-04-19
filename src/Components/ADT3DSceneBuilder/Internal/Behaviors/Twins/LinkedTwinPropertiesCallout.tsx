import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    SearchBox,
    FocusTrapCallout,
    Text,
    useTheme,
    Spinner,
    SpinnerSize,
    mergeStyleSets,
    IStyle
} from '@fluentui/react';
import { IADT3DSceneBuilderLinkedTwinPropertiesCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { CardboardBasicList } from '../../../../CardboardBasicList/CardboardBasicList';

const LinkedTwinPropertiesCallout: React.FC<IADT3DSceneBuilderLinkedTwinPropertiesCalloutProps> = ({
    commonLinkedTwinProperties,
    isLoading,
    calloutTarget,
    hideCallout
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [filteredProperties, setFilteredProperties] = useState<Array<string>>(
        commonLinkedTwinProperties
    );

    const searchProperty = useCallback(
        (searchTerm: string) => {
            setFilteredProperties(
                commonLinkedTwinProperties.filter((property) =>
                    property.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        },
        [commonLinkedTwinProperties]
    );

    useEffect(() => {
        setFilteredProperties(commonLinkedTwinProperties);
    }, [commonLinkedTwinProperties]);

    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);
    return (
        <FocusTrapCallout
            focusTrapProps={{
                isClickableOutsideFocusTrap: true
            }}
            onDismiss={hideCallout}
            target={`#${calloutTarget}`}
            setInitialFocus
            directionalHint={DirectionalHint.rightTopEdge}
            styles={{ calloutMain: { width: 292, padding: 20 } }}
        >
            <h4 style={{ margin: 0 }}>
                {t('3dSceneBuilder.twinAlias.commonProperties')}
            </h4>
            <Text className={commonPanelStyles.text}>
                {t('3dSceneBuilder.twinAlias.descriptions.commonProperties')}
            </Text>
            {commonLinkedTwinProperties.length > 0 && (
                <SearchBox
                    styles={{ root: { margin: '16px 0px' } }}
                    data-testid={'twin-alias-callout-search'}
                    placeholder={t('3dSceneBuilder.twinAlias.searchProperties')}
                    onChange={(_event, value) => {
                        setSearchText(value);
                        searchProperty(value);
                    }}
                />
            )}
            {isLoading ? (
                <Spinner size={SpinnerSize.xSmall} />
            ) : filteredProperties.length === 0 ? (
                <div className={styles.resultText}>
                    {t('3dSceneBuilder.noLinkedTwinProperties')}
                </div>
            ) : (
                <CardboardBasicList
                    className={styles.list}
                    items={filteredProperties}
                    listKey={`common-properties-callout-list`}
                    textToHighlight={searchText}
                />
            )}
        </FocusTrapCallout>
    );
};

const styles = mergeStyleSets({
    list: {
        '.cb-basic-list-item-root': {
            padding: '8px 12px 8px 0'
        } as IStyle
    },
    resultText: {
        fontSize: '12px',
        marginTop: '5px',
        opacity: '0.6'
    }
});

export default LinkedTwinPropertiesCallout;
