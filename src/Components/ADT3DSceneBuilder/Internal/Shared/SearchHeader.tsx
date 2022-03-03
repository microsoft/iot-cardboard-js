import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, SearchBox, Separator, useTheme } from '@fluentui/react';
import { getSeparatorStyles } from './LeftPanel.styles';

interface WithMultiSelect {
    isSelectionEnabled: boolean;
    onMultiSelectClicked: () => void;
}
interface WithoutMultiSelect {
    isSelectionEnabled?: undefined;
    onMultiSelectClicked?: undefined;
}
export type SearchHeaderProps = {
    placeholder: string;
    searchText: string;
    onSearchTextChange: (text: string) => void;
} & (WithoutMultiSelect | WithMultiSelect);
const SearchHeader: React.FC<SearchHeaderProps> = ({
    isSelectionEnabled,
    onMultiSelectClicked,
    onSearchTextChange,
    placeholder,
    searchText
}) => {
    const { t } = useTranslation();
    const theme = useTheme();
    return (
        <>
            <div className="cb-scene-builder-element-search-header">
                <div className="cb-scene-builder-element-search-box">
                    <SearchBox
                        data-testid={'search-header-search-box'}
                        placeholder={placeholder}
                        onChange={(_e, value) => onSearchTextChange(value)}
                        value={searchText}
                    />
                </div>
                {onMultiSelectClicked && (
                    <IconButton
                        data-testid={'search-header-multi-select'}
                        iconProps={{ iconName: 'MultiSelect' }}
                        title={t('3dSceneBuilder.multiSelectElements')}
                        styles={{
                            iconChecked: { color: '#ffffff' },
                            iconHovered: { color: '#ffffff' },
                            rootChecked: { background: '#0078d4' },
                            rootHovered: { background: '#0078d4' },
                            rootCheckedHovered: {
                                background: '#0078d4'
                            }
                        }}
                        ariaLabel={t('3dSceneBuilder.multiSelectElements')}
                        onClick={onMultiSelectClicked}
                        checked={isSelectionEnabled}
                    />
                )}
            </div>
            <Separator styles={getSeparatorStyles(theme)} />
        </>
    );
};
export default SearchHeader;
