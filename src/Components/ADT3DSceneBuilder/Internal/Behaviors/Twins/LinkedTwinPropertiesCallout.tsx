import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    SearchBox,
    FocusTrapCallout,
    Text,
    useTheme,
    Spinner,
    SpinnerSize,
    memoizeFunction,
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
            <SearchBox
                styles={{ root: { margin: '16px 0px' } }}
                data-testid={'twin-alias-callout-search'}
                placeholder={t('3dSceneBuilder.twinAlias.searchProperties')}
                onChange={(_event, value) => {
                    setSearchText(value);
                    searchProperty(value);
                }}
            />
            {isLoading ? (
                <Spinner size={SpinnerSize.xSmall} />
            ) : (
                <CardboardBasicList
                    className={getListStyle.root}
                    items={filteredProperties}
                    listKey={`common-properties-callout-list`}
                    textToHighlight={searchText}
                />
            )}
        </FocusTrapCallout>
    );
};

const getListStyle = mergeStyleSets({
    root: {
        '.cb-basic-list-item-root': {
            padding: '8px 12px 8px 0'
        } as IStyle
    }
});

export default LinkedTwinPropertiesCallout;
