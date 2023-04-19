import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';
import { Label, Stack, Text } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { ICardboardComboBoxSelectProps } from './CardboardComboBox.types';
import { IReactSelectOption } from '../../Models';
import { getReactSelectStyles } from '../../../../Resources/Styles/ReactSelect.styles';
import { getStyles } from './CardboardComboBox.styles';
import TooltipCallout from '../../../../Components/TooltipCallout/TooltipCallout';

const debugLogging = false;
const logDebugConsole = getDebugLogger('CardboardComboBoxSelect', debugLogging);

const CardboardComboBoxSelect = <T extends IReactSelectOption>(
    props: ICardboardComboBoxSelectProps<T> & { children?: ReactNode }
) => {
    const {
        description,
        descriptionIsError = false,
        label,
        options: optionsProp,
        onSelectionChange,
        placeholder,
        required,
        selectedItem,
        tooltip
    } = props;

    // contexts

    // state
    const [options, setOptions] = useState<T[]>(optionsProp);

    // hooks
    const id = useId('creatable-select');

    // callbacks
    const onChange = useCallback(
        (
            selection: MultiValue<T> | SingleValue<T>,
            actionMeta: ActionMeta<T>
        ) => {
            // cast is safe here because `SingleValue` is just an alias to `T` which is what our options are
            const localOption = selection as T;
            const isCreate = actionMeta.action === 'create-option';
            onSelectionChange(localOption, isCreate);
            if (isCreate) {
                setOptions((draft) => {
                    draft.push(localOption);
                    return draft;
                });
            }
        },
        [onSelectionChange]
    );

    // side effects
    useEffect(() => {
        setOptions(optionsProp);
    }, [optionsProp]);

    // styles
    const theme = useExtendedTheme();
    const classNames = getStyles({
        theme,
        isDescriptionError: descriptionIsError
    });
    const selectStyles = useMemo(() => getReactSelectStyles<T>(theme, {}), [
        theme
    ]);

    logDebugConsole('debug', 'Render');

    return (
        <Stack>
            <Stack horizontal verticalAlign={'center'}>
                <Label id={id} required={required} className={classNames.label}>
                    {label}
                </Label>
                {tooltip && <TooltipCallout {...tooltip} />}
            </Stack>
            <CreatableSelect
                {...props}
                aria-aria-labelledby={id}
                onChange={onChange}
                options={options}
                placeholder={placeholder}
                styles={selectStyles}
                value={selectedItem}
            />
            {description && (
                <Text variant={'small'} className={classNames.description}>
                    {description}
                </Text>
            )}
        </Stack>
    );
};

export default CardboardComboBoxSelect;
