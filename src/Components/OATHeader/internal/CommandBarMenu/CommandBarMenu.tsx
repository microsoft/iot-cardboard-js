import React, { useState } from 'react';
import {
    ICommandBarMenuItemType,
    ICommandBarMenuProps,
    ICommandBarMenuStyleProps,
    ICommandBarMenuStyles
} from './CommandBarMenu.types';
import { getStyles } from './CommandBarMenu.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Callout,
    ActionButton,
    Separator,
    DirectionalHint
} from '@fluentui/react';

const getClassNames = classNamesFunction<
    ICommandBarMenuStyleProps,
    ICommandBarMenuStyles
>();
const getElementWidth = (elementId: string) => {
    const buttonElement = document.getElementById(elementId);
    return buttonElement?.offsetWidth;
};

const CommandBarMenu: React.FC<ICommandBarMenuProps> = (props) => {
    const { isMenuOpen, items, onMenuClose, styles, targetId } = props;

    // contexts

    // state
    const [buttonElementWidth, setButtonElementWidth] = useState<number>();

    // hooks

    // callbacks

    // side effects

    // styles
    const elementWidth = getElementWidth(targetId);
    if (!elementWidth) {
        // if we don't find the element, wait till after first paint, then try again and force a render
        setTimeout(() => {
            setButtonElementWidth(getElementWidth(targetId));
        }, 1);
    }
    const classNames = getClassNames(styles, {
        theme: useTheme(),
        menuMinWidth: buttonElementWidth
    });

    return (
        <div className={classNames.root}>
            {isMenuOpen && (
                <Callout
                    styles={classNames.subComponentStyles.callout}
                    role="dialog"
                    gapSpace={0}
                    target={`#${targetId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    onDismiss={onMenuClose}
                    directionalHint={DirectionalHint.bottomLeftEdge}
                >
                    {items.map((item) => {
                        switch (item.menuItemType) {
                            case ICommandBarMenuItemType.Button:
                                return (
                                    <ActionButton
                                        styles={{
                                            ...classNames.subComponentStyles.menuItemButton(),
                                            ...item.styles
                                        }}
                                        {...item}
                                    />
                                );
                            case ICommandBarMenuItemType.Divider:
                                return (
                                    <Separator
                                        styles={
                                            classNames.subComponentStyles
                                                .menuItemSeparator
                                        }
                                    />
                                );
                        }
                    })}
                </Callout>
            )}
        </div>
    );
};

export default styled<
    ICommandBarMenuProps,
    ICommandBarMenuStyleProps,
    ICommandBarMenuStyles
>(CommandBarMenu, getStyles);
