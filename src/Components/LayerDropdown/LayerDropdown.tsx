import React from 'react';
import { LayerDropdownProps } from './LayerDropdown.types';
import { dropdownStyles, iconStyles } from './LayerDropdown.styles';
import {
    Dropdown,
    Icon,
    IDropdownOption,
    IDropdownProps,
    ILayer
} from '@fluentui/react';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';

const LayerDropdown: React.FC<LayerDropdownProps> = ({
    layers,
    selectedLayerIds,
    setSelectedLayerIds
}) => {
    const { t } = useTranslation();

    const options: IDropdownOption<ILayer>[] = layers.map((layer) => ({
        key: layer.id,
        text: layer.displayName,
        ariaLabel: layer.displayName
    }));

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

    const onRenderTitle = (
        options: IDropdownOption<ILayer>[],
        defaultRender
    ): JSX.Element => {
        return (
            <>
                {layerIcon}
                {defaultRender(options)}
            </>
        );
    };

    const onRenderPlaceholder = (props: IDropdownProps): JSX.Element => {
        return (
            <div>
                {layerIcon}
                <span>{props.placeholder}</span>
            </div>
        );
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
            styles={dropdownStyles}
            multiSelect
        />
    );
};

const layerIcon = (
    <Icon
        iconName={'MapLayers'}
        aria-hidden="true"
        title={i18n.t('layersDropdown.title')}
        styles={iconStyles}
    />
);

export default LayerDropdown;
