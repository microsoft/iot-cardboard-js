import {
    classNamesFunction,
    Dropdown,
    IDropdownOption,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../../../../../i18n';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../../Theming/Palettes';
import ColorPicker from '../../../../../Pickers/ColorSelectButton/ColorPicker';
import IconPicker from '../../../../../Pickers/IconSelectButton/IconPicker';
import { IPickerOption } from '../../../../../Pickers/Internal/Picker.base.types';
import { getStyles } from './ActionItem.styles';
import {
    IActionItemStyleProps,
    IActionItemStyles,
    IActionItemProps
} from './ActionItem.types';

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    visualLabel: `${ROOT_LOC}.visualLabel`,
    colorLabel: `${ROOT_LOC}.colorLabel`,
    iconLabel: `${ROOT_LOC}.iconLabel`,
    elementColoringOption: `${ROOT_LOC}.elementColoringOption`,
    badgeOption: `${ROOT_LOC}.badgeOption`
};

const MESH_COLORING_KEY = 'Mesh-coloring-action-item';
const BADGE_KEY = 'Badge-action-item';

const DROPDOWN_OPTIONS: IDropdownOption[] = [
    {
        key: MESH_COLORING_KEY,
        text: i18n.t(LOC_KEYS.elementColoringOption)
    },
    {
        key: BADGE_KEY,
        text: i18n.t(LOC_KEYS.badgeOption)
    }
];

const getClassNames = classNamesFunction<
    IActionItemStyleProps,
    IActionItemStyles
>();

const ActionItem: React.FC<IActionItemProps> = (props) => {
    // props
    const { color, iconName, setActionSelectedValue, styles } = props;

    // hooks
    const { t } = useTranslation();

    // state
    const [selectedOptionKey, setSelectedOptionKey] = useState(
        iconName ? DROPDOWN_OPTIONS[1].key : DROPDOWN_OPTIONS[0].key
    );

    // side-effects
    useEffect(() => {
        if (!iconName) {
            setSelectedOptionKey(DROPDOWN_OPTIONS[0].key);
        } else {
            setSelectedOptionKey(DROPDOWN_OPTIONS[1].key);
        }
    }, [iconName]);

    // callbacks
    const handleOnDropdownChange = useCallback(
        (
            _event: React.FormEvent<HTMLDivElement>,
            option?: IDropdownOption<any>
        ) => {
            if (option) {
                setSelectedOptionKey(option.key);
                if (option.key === DROPDOWN_OPTIONS[0].key) {
                    setActionSelectedValue('iconName', undefined);
                }
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

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Stack horizontal={true} tokens={{ childrenGap: 8 }}>
            <Dropdown
                label={t(LOC_KEYS.visualLabel)}
                options={DROPDOWN_OPTIONS}
                selectedKey={selectedOptionKey}
                onChange={handleOnDropdownChange}
                styles={classNames.subComponentStyles.dropdown}
            />
            <ColorPicker
                selectedItem={color}
                items={defaultSwatchColors}
                label={t(LOC_KEYS.colorLabel)}
                onChangeItem={onColorChange}
                styles={classNames.subComponentStyles.colorPicker}
            />
            {selectedOptionKey === BADGE_KEY && (
                <IconPicker
                    selectedItem={iconName}
                    items={defaultSwatchIcons}
                    label={t(LOC_KEYS.iconLabel)}
                    onChangeItem={onIconChange}
                />
            )}
        </Stack>
    );
};

export default styled<
    IActionItemProps,
    IActionItemStyleProps,
    IActionItemStyles
>(ActionItem, getStyles);
