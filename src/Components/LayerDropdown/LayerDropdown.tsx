import React from 'react';
import { LayerDropdownProps } from './LayerDropdown.types';
import {
    defaultLayerButtonStyles,
    dropdownStyles,
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

const LayerDropdown: React.FC<LayerDropdownProps> = ({
    layers,
    selectedLayerIds,
    setSelectedLayerIds
}) => {
    const { t } = useTranslation();

    const options: IDropdownOption<ILayer>[] = [
        { key: 'defaultLayer', text: t('layersDropdown.defaultLayer') },
        {
            key: 'divider-1',
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

    const onChange = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<any>
    ) => {
        if (option) {
            if (option.key === 'defaultLayer') {
                setSelectedLayerIds([]);
            } else {
                setSelectedLayerIds(
                    option.selected
                        ? [...selectedLayerIds, option.key as string]
                        : selectedLayerIds.filter((key) => key !== option.key)
                );
            }
        }
    };

    const onRenderTitle = (
        options: IDropdownOption<ILayer>[],
        defaultRender
    ): JSX.Element => {
        return (
            <>
                <LayerIcon />
                {defaultRender(options)}
            </>
        );
    };

    const onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
        return (
            <div>
                <LayerIcon />
                <span>{props.placeholder}</span>
            </div>
        );
    };

    const onRenderItem: IRenderFunction<ISelectableOption<any>> = (
        props: ISelectableOption,
        defaultRender: (props?: ISelectableOption) => JSX.Element | null
    ) => {
        if (props.key === 'defaultLayer') {
            return (
                <div>
                    <ActionButton
                        iconProps={{ iconName: 'RedEye' }}
                        width={'100%'}
                        styles={defaultLayerButtonStyles}
                        onClick={() => onChange(null, props)}
                    >
                        {t('layersDropdown.defaultLayer')}
                    </ActionButton>
                </div>
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

export default LayerDropdown;
