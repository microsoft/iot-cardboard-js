import React, { useCallback, useMemo } from 'react';
import { LayerDropdownProps } from './LayerDropdown.types';
import {
    defaultLayerButtonStyles,
    getDropdownStyles,
    getEyeIconStyles,
    getStyles,
    iconStyles
} from './LayerDropdown.styles';
import {
    ActionButton,
    Dropdown,
    DropdownMenuItemType,
    Icon,
    IDropdownOption,
    IDropdownProps,
    IRenderFunction,
    ISelectableOption,
    useTheme
} from '@fluentui/react';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { ILayer } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

export const DEFAULT_LAYER_ID = 'scene-layer-dropdown-unlayered-behaviors';
export const showHideAllKey = 'show-hide-all';

const LayerDropdown: React.FC<LayerDropdownProps> = ({
    layers,
    selectedLayerIds,
    setSelectedLayerIds,
    showUnlayeredOption = true
}) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const options = useMemo(
        () =>
            getLayerOptionsData(layers, showUnlayeredOption, selectedLayerIds),
        [layers, showUnlayeredOption, selectedLayerIds]
    );

    const onChange = useCallback(
        (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
            if (option) {
                setSelectedLayerIds(
                    option.selected
                        ? [...selectedLayerIds, option.key as string]
                        : selectedLayerIds.filter((key) => key !== option.key)
                );
            }
        },
        [setSelectedLayerIds, selectedLayerIds]
    );

    const hasNoLayerOptions = layers.length === 0; // select all, divider, default, divider
    const styles = getStyles();
    const dropdownStyles = getDropdownStyles(theme, hasNoLayerOptions);

    const onRenderTitle = useCallback(
        (options: IDropdownOption[], defaultRender): JSX.Element => {
            return (
                <>
                    <LayerIcon />
                    <div className={styles.titleText}>
                        {defaultRender(
                            options.map((o) => ({
                                ...o,
                                ...(o.key === DEFAULT_LAYER_ID
                                    ? {
                                          text: t(
                                              'layersDropdown.unlayeredItemCollapsedDisplayName'
                                          )
                                      }
                                    : {})
                            }))
                        )}
                    </div>
                </>
            );
        },
        [styles.titleText, t]
    );

    const onRenderPlaceholder = useCallback(
        (props: IDropdownProps): JSX.Element => {
            return (
                <div className={styles.placeHolderContainer}>
                    <LayerIcon />
                    <div className={styles.titleText}>{props.placeholder}</div>
                </div>
            );
        },
        [styles]
    );

    const onShowHide = useCallback(
        (isSelectAllMode: boolean) => {
            if (isSelectAllMode) {
                setSelectedLayerIds([
                    DEFAULT_LAYER_ID,
                    ...layers.map((l) => l.id)
                ]);
            } else {
                setSelectedLayerIds([]);
            }
        },
        [setSelectedLayerIds, layers]
    );

    const onRenderItem: IRenderFunction<ISelectableOption<any>> = useCallback(
        (
            props: ISelectableOption,
            defaultRender: (props?: ISelectableOption) => JSX.Element | null
        ) => {
            if (props.key === showHideAllKey) {
                return (
                    <ActionButton
                        key={props.key}
                        iconProps={{
                            iconName: 'MultiSelect',
                            styles: (props) => getEyeIconStyles(props.theme)
                        }}
                        width={'100%'}
                        styles={defaultLayerButtonStyles}
                        onClick={() => onShowHide(props.data?.isSelectAllMode)}
                    >
                        {props.text}
                    </ActionButton>
                );
            } else {
                return defaultRender(props);
            }
        },
        [onShowHide]
    );

    return (
        <Dropdown
            disabled={hasNoLayerOptions}
            placeholder={
                hasNoLayerOptions
                    ? t('layersDropdown.unlayeredItemListItemDisplayName')
                    : t('layersDropdown.placeholder')
            }
            title={t('layersDropdown.title')}
            selectedKeys={selectedLayerIds}
            onChange={onChange}
            options={options}
            onRenderTitle={onRenderTitle}
            onRenderPlaceholder={onRenderPlaceholder}
            onRenderItem={onRenderItem}
            styles={dropdownStyles}
            multiSelect
        />
    );
};

const LayerIcon = () => (
    <Icon
        iconName={'MapLayers'}
        aria-hidden="true"
        title={i18n.t('layersDropdown.title')}
        styles={iconStyles}
    />
);

const getLayerOptionsData = (
    layers: ILayer[] = [],
    showUnlayeredOption: boolean,
    selectedLayerIds: string[] = []
) => {
    const options: IDropdownOption[] = [
        ...(showUnlayeredOption
            ? [
                  {
                      key: DEFAULT_LAYER_ID,
                      text: i18n.t(
                          'layersDropdown.unlayeredItemListItemDisplayName'
                      )
                  }
              ]
            : []),
        {
            key: 'divider-2',
            text: '-',
            itemType: DropdownMenuItemType.Divider
        }
    ].concat(
        layers.map((layer) => ({
            key: layer.id,
            text: layer.displayName,
            ariaLabel: layer.displayName
        }))
    );

    const layerOptions = options.filter(
        (option) =>
            option.itemType !== DropdownMenuItemType.Divider &&
            option.itemType !== DropdownMenuItemType.Header
    );
    const numLayerOptions = layerOptions.length;
    const numSelectedOptions = layerOptions.filter((option) =>
        selectedLayerIds.includes(String(option.key))
    ).length;
    const isSelectAllMode = numSelectedOptions < Math.ceil(numLayerOptions / 2);

    options.unshift(
        {
            key: showHideAllKey,
            text: isSelectAllMode
                ? i18n.t('layersDropdown.selectAll')
                : i18n.t('layersDropdown.selectNone'),
            data: { isSelectAllMode }
        },
        {
            key: 'divider-1',
            text: '-',
            itemType: DropdownMenuItemType.Divider
        }
    );

    return options;
};

export default React.memo(LayerDropdown);
