import {
    Callout,
    classNamesFunction,
    IColorCellProps,
    Label,
    styled,
    SwatchColorPicker,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useMemo } from 'react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { getStyles } from './Picker.base.styles';
import {
    IPickerBaseProps,
    IPickerBaseStyleProps,
    IPickerBaseStyles
} from './Picker.base.types';

const getClassNames = classNamesFunction<
    IPickerBaseStyleProps,
    IPickerBaseStyles
>();

const PickerBase: React.FC<IPickerBaseProps> = ({
    selectedItem,
    items,
    label,
    onChangeItem,
    onRenderButton,
    onRenderItem,
    styles
}) => {
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const labelId = useId('callout-label');
    const buttonId = useId('color-button');

    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(
        false
    );

    // convert the generic props to the color swatch item props
    const swatchItems = useMemo(() => {
        const converted: IColorCellProps[] = items.map((x) => ({
            color: x.item,
            id: x.id,
            index: x.index,
            label: x.label
        }));
        return converted;
    }, [items]);

    const handleClick = useCallback(
        (item: string) => {
            toggleIsCalloutVisible();
            onChangeItem(items.find((x) => x.item === item));
        },
        [items, onChangeItem, toggleIsCalloutVisible]
    );

    // map the callback to nicely exposed props in callback
    const onChange = useCallback(
        (_e, _id, item: string) => {
            handleClick(item);
        },
        [handleClick]
    );

    // map the callback to nicely exposed props in callback
    const onRenderItemInternal = useCallback(
        (
            props: IColorCellProps,
            _defaultRenderer: (props?: IColorCellProps) => JSX.Element
        ) =>
            onRenderItem &&
            onRenderItem(
                items.find((x) => x.item === props.color),
                handleClick
            ),
        [handleClick, items, onRenderItem]
    );

    return (
        // root node is needed to prevent bouncing when callout opens
        <div className={classNames.root}>
            {label && <Label>{label}</Label>}
            {onRenderButton(toggleIsCalloutVisible, buttonId)}
            {isCalloutVisible && (
                <Callout
                    ariaLabelledBy={labelId}
                    target={`#${buttonId}`}
                    onDismiss={toggleIsCalloutVisible}
                    setInitialFocus
                    styles={classNames.subComponentStyles.callout}
                >
                    <SwatchColorPicker
                        columnCount={3}
                        cellShape={'circle'}
                        colorCells={swatchItems}
                        aria-labelledby={labelId}
                        onChange={onChange}
                        onRenderColorCell={onRenderItem && onRenderItemInternal}
                        selectedId={
                            swatchItems.find(
                                (color) => color.color === selectedItem
                            )?.id
                        }
                    />
                </Callout>
            )}
        </div>
    );
};

export default styled<
    IPickerBaseProps,
    IPickerBaseStyleProps,
    IPickerBaseStyles
>(PickerBase, getStyles);
