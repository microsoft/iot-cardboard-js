import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    IButtonStyles,
    IconButton,
    ISearchBoxStyles,
    IStyle,
    memoizeFunction,
    mergeStyleSets,
    SearchBox,
    Theme,
    useTheme
} from '@fluentui/react';

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
            <div className={styles.root}>
                <SearchBox
                    data-testid={'search-header-search-box'}
                    placeholder={placeholder}
                    onChange={(_e, value) => onSearchTextChange(value)}
                    value={searchText}
                    styles={searchBoxStyles}
                />
                {onMultiSelectClicked && (
                    <IconButton
                        data-testid={'search-header-multi-select'}
                        iconProps={{ iconName: 'MultiSelect' }}
                        title={t('3dSceneBuilder.multiSelectElements')}
                        styles={getIconButtonStyles(theme)}
                        ariaLabel={t('3dSceneBuilder.multiSelectElements')}
                        onClick={onMultiSelectClicked}
                        checked={isSelectionEnabled}
                    />
                )}
            </div>
        </>
    );
};
const classPrefix = 'search-header';
const classNames = {
    root: `${classPrefix}-root`
};
const styles = mergeStyleSets({
    root: [
        classNames.root,
        {
            display: 'flex',
            marginBottom: 12
        } as IStyle
    ]
});
const searchBoxStyles: ISearchBoxStyles = {
    root: {
        flex: 1
    }
};
const getIconButtonStyles = memoizeFunction(
    (theme: Theme): IButtonStyles => ({
        iconChecked: { color: theme.palette.white },
        iconHovered: { color: theme.palette.white },
        root: { marginLeft: 4 },
        rootChecked: {
            background: theme.palette.themePrimary
        },
        rootCheckedHovered: {
            background: theme.palette.themePrimary
        },
        rootHovered: {
            background: theme.palette.themePrimary
        }
    })
);
export default SearchHeader;
