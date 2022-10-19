import { Dropdown, IDropdownOption, Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../../Theming/Palettes';
import ColorPicker from '../../../../../Pickers/ColorSelectButton/ColorPicker';
import IconPicker from '../../../../../Pickers/IconSelectButton/IconPicker';
import { IPickerOption } from '../../../../../Pickers/Internal/Picker.base.types';
import { IActionItemProps } from './ConditionsCallout.types';

const DROPDOWN_OPTIONS: IDropdownOption[] = [
    {
        key: 'Mesh-coloring-action-item',
        text: 'Mesh coloring'
    },
    {
        key: 'Badge-action-item',
        text: 'Badge'
    }
];

export const ActionItem: React.FC<IActionItemProps> = (props) => {
    // props
    const { color, iconName, setActionSelectedValue } = props;

    // hooks
    // const { t } = useTranslation();

    // state
    const [selectedOption, setSelectedOption] = useState(
        iconName ? DROPDOWN_OPTIONS[1].key : DROPDOWN_OPTIONS[0].key
    );

    // side-effects
    useEffect(() => {
        if (!iconName) {
            setSelectedOption(DROPDOWN_OPTIONS[0].key);
        } else {
            setSelectedOption(DROPDOWN_OPTIONS[1].key);
        }
    }, [iconName]);

    // callbacks
    const handleOnDropdownChange = useCallback(
        (
            _event: React.FormEvent<HTMLDivElement>,
            option?: IDropdownOption<any>
        ) => {
            if (option) {
                setSelectedOption(option.key);
            }
        },
        []
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) =>
            setActionSelectedValue('color', newValue.item),
        [setActionSelectedValue]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) =>
            setActionSelectedValue('iconName', newValue.item),
        [setActionSelectedValue]
    );

    const renderPicker = () => {
        switch (selectedOption) {
            case 'Mesh-coloring-action-item':
                return (
                    <ColorPicker
                        selectedItem={color}
                        items={defaultSwatchColors}
                        label={'Colors'}
                        onChangeItem={onColorChange}
                        styles={{
                            // match the icon picker
                            button: {
                                height: 32,
                                width: 32
                            }
                        }}
                    />
                );
            case 'Badge-action-item':
                return (
                    <IconPicker
                        selectedItem={iconName}
                        items={defaultSwatchIcons}
                        label={'Icons'}
                        onChangeItem={onIconChange}
                    />
                );
        }
    };

    return (
        <>
            <Stack>
                {/* TODO: LOC THIS */}
                <p>Actions</p>
                <Stack horizontal={true} tokens={{ childrenGap: 8 }}>
                    <Dropdown
                        // TODO: LOC THIS
                        label={'type'}
                        options={DROPDOWN_OPTIONS}
                        selectedKey={selectedOption}
                        onChange={handleOnDropdownChange}
                    />
                    {renderPicker()}
                </Stack>
            </Stack>
        </>
    );
};
