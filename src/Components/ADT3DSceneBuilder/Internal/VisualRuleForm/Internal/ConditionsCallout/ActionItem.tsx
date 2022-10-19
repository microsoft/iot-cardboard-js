import { Dropdown, IDropdownOption, Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    actionsTitle: `${ROOT_LOC}.actionsTitle`,
    actionTypeLabel: `${ROOT_LOC}.actionTypeLabel`,
    colorLabel: `${ROOT_LOC}.colorLabel`,
    iconLabel: `${ROOT_LOC}.iconLabel`
};

export const ActionItem: React.FC<IActionItemProps> = (props) => {
    // props
    const { color, iconName, setActionSelectedValue } = props;

    // hooks
    const { t } = useTranslation();

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

    return (
        <>
            <Stack tokens={{ childrenGap: 8 }}>
                <div>{t(LOC_KEYS.actionsTitle)}</div>
                <Stack horizontal={true} tokens={{ childrenGap: 8 }}>
                    <Dropdown
                        label={t(LOC_KEYS.actionTypeLabel)}
                        options={DROPDOWN_OPTIONS}
                        selectedKey={selectedOption}
                        onChange={handleOnDropdownChange}
                    />
                    <ColorPicker
                        selectedItem={color}
                        items={defaultSwatchColors}
                        label={t(LOC_KEYS.colorLabel)}
                        onChangeItem={onColorChange}
                        styles={{
                            // match the icon picker
                            button: {
                                height: 32,
                                width: 32
                            }
                        }}
                    />
                    {selectedOption === 'Badge-action-item' && (
                        <IconPicker
                            selectedItem={iconName}
                            items={defaultSwatchIcons}
                            label={t(LOC_KEYS.iconLabel)}
                            onChangeItem={onIconChange}
                        />
                    )}
                </Stack>
            </Stack>
        </>
    );
};
