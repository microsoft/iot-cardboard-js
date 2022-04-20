import React from 'react';
import { LayerDropdownProps } from './LayerDropdown.types';
import {
    defaultLayerButtonStyles,
    dropdownStyles,
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
    ILayer,
    IRenderFunction,
    ISelectableOption
} from '@fluentui/react';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

export const unlayeredBehaviorKey = 'scene-layer-dropdown-unlayered-behaviors';
export const showHideAllKey = 'show-hide-all';

const LayerDropdown: React.FC<LayerDropdownProps> = ({
    layers,
    selectedLayerIds,
    setSelectedLayerIds,
    showUnlayeredOption = true
}) => {
    const { t } = useTranslation();

    const options: IDropdownOption<ILayer>[] = [
        ...(showUnlayeredOption
            ? [
                  {
                      key: unlayeredBehaviorKey,
                      text: t('layersDropdown.unlayeredBehaviors')
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
    const isShow = numSelectedOptions < Math.ceil(numLayerOptions / 2);

    options.unshift(
        {
            key: showHideAllKey,
            text: isShow
                ? t('layersDropdown.selectAll')
                : t('layersDropdown.selectNone'),
            data: { isShow }
        },
        {
            key: 'divider-1',
            text: '-',
            itemType: DropdownMenuItemType.Divider
        }
    );

    const onChange = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<any>
    ) => {
        if (option) {
            setSelectedLayerIds(
                option.selected
                    ? [...selectedLayerIds, option.key as string]
                    : selectedLayerIds.filter((key) => key !== option.key)
            );
        }
    };

    const styles = getStyles();

    const onRenderTitle = (
        options: IDropdownOption<ILayer>[],
        defaultRender
    ): JSX.Element => {
        return (
            <>
                <LayerIcon />
                <div className={styles.titleText}>
                    {defaultRender(
                        options.map((o) => ({
                            ...o,
                            ...(o.key === unlayeredBehaviorKey
                                ? { text: t('layersDropdown.unlayered') }
                                : {})
                        }))
                    )}
                </div>
            </>
        );
    };

    const onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
        return (
            <div className={styles.placeHolderContainer}>
                <LayerIcon />
                <div className={styles.titleText}>{props.placeholder}</div>
            </div>
        );
    };

    const onShowHide = (isShow: boolean) => {
        if (isShow) {
            setSelectedLayerIds([
                unlayeredBehaviorKey,
                ...layers.map((l) => l.id)
            ]);
        } else {
            setSelectedLayerIds([]);
        }
    };

    const onRenderItem: IRenderFunction<ISelectableOption<any>> = (
        props: ISelectableOption,
        defaultRender: (props?: ISelectableOption) => JSX.Element | null
    ) => {
        if (props.key === showHideAllKey) {
            return (
                <ActionButton
                    key={props.key}
                    iconProps={{
                        iconName: !props.data?.isShow ? 'Hide' : 'RedEye',
                        styles: (props) => getEyeIconStyles(props.theme)
                    }}
                    width={'100%'}
                    styles={defaultLayerButtonStyles}
                    onClick={() => onShowHide(props.data?.isShow)}
                >
                    {props.text}
                </ActionButton>
            );
        } else {
            return defaultRender(props);
        }
    };

    if (layers.length === 0) return null;

    return (
        <Dropdown
            placeholder={t('layersDropdown.placeholder')}
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

export default React.memo(LayerDropdown);
