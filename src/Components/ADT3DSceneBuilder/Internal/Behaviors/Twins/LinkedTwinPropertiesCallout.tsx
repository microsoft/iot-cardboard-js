import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DirectionalHint,
    SearchBox,
    FocusTrapCallout,
    Text,
    useTheme,
    Spinner,
    SpinnerSize
} from '@fluentui/react';
import { IADT3DSceneBuilderLinkedTwinPropertiesCalloutProps } from '../../../ADT3DSceneBuilder.types';
import { CardboardList } from '../../../../CardboardList';
import { ICardboardListItem } from '../../../../CardboardList/CardboardList.types';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';

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

    const listItems = useMemo(() => getListItems(filteredProperties), [
        filteredProperties
    ]);

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
                <CardboardList<string>
                    items={listItems}
                    listKey={`common-properties-callout-list`}
                    textToHighlight={searchText}
                />
            )}
        </FocusTrapCallout>
    );
};

function getListItems(filteredProperties: Array<string>) {
    return (
        filteredProperties?.map((item) => {
            const viewModel: ICardboardListItem<string> = {
                ariaLabel: '',
                item: item,
                openMenuOnClick: true,
                textPrimary: item
            };

            return viewModel;
        }) ?? []
    );
}

export default LinkedTwinPropertiesCallout;
