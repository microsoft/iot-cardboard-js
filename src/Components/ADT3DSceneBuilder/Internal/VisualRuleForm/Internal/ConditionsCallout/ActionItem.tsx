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
import { hasBadge } from './ConditionCalloutUtility';

const ROOT_LOC = '3dSceneBuilder.visualRuleForm';
const LOC_KEYS = {
    actionLabel: `${ROOT_LOC}.actionLabel`,
    colorLabel: `${ROOT_LOC}.colorLabel`,
    iconLabel: `${ROOT_LOC}.iconLabel`,
    meshColoringOption: `${ROOT_LOC}.meshColoringOption`,
    badgeOption: `${ROOT_LOC}.badgeOption`
};

const MESH_COLORING_KEY = 'Mesh-coloring-action-item';
const BADGE_KEY = 'Badge-action-item';

const DROPDOWN_OPTIONS: IDropdownOption[] = [
    {
        key: MESH_COLORING_KEY,
        text: i18n.t(LOC_KEYS.meshColoringOption)
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
        hasBadge(iconName) ? DROPDOWN_OPTIONS[1].key : DROPDOWN_OPTIONS[0].key
    );

    // side-effects
    useEffect(() => {
        if (!hasBadge(iconName)) {
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
                label={t(LOC_KEYS.actionLabel)}
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
