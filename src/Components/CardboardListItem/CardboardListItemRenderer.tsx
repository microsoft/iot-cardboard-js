import {
    Checkbox,
    ContextualMenu,
    DefaultButton,
    DirectionalHint,
    FontIcon,
    getTheme,
    IButtonStyles,
    Icon,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    KeyCodes,
    mergeStyleSets,
    Stack
} from '@fluentui/react';
import React, { useRef, useState } from 'react';
import { Utils } from '../..';

type IIconNames = string | 'Shapes';
interface ICardboardListItemProps {
    /** screen reader text to use for the list item */
    ariaLabel: string;
    /** icon to render on the right side of the list item */
    iconEndName?: IIconNames;
    /** icon to render at the left side of the list item */
    iconStartName?: IIconNames;
    /** index of the item in the list */
    index: number;
    /** if provided will result in rendering the checkbox in either checked or unchecked state. If not provided, will not render a checkbox */
    isSelected?: boolean;
    /** triggered when list item is clicked */
    onClick: () => void;
    /** List items to show in the overflow set */
    overflowMenuItems?: IContextualMenuItem[];
    /** primary text to show */
    textPrimary: string;
    /** secondary text to show below the main text */
    textSecondary?: string;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}

const theme = getTheme();
const { palette } = theme;
const styles = mergeStyleSets({
    textContainer: {
        flexGrow: 1,
        alignItems: 'start'
    },
    primaryText: {
        color: palette.neutralDark
    },
    secondaryText: {
        color: palette.neutralPrimary
    },
    icon: {}
});
const buttonStyles: IButtonStyles = {
    root: {
        alignItems: 'start',
        padding: '14px',
        height: 'auto'
    },
    flexContainer: {
        justifyContent: 'start'
    }
};

export const CardboardListItemRenderer: React.FC<ICardboardListItemProps> = ({
    iconEndName,
    iconStartName,
    index,
    isSelected,
    overflowMenuItems,
    textPrimary,
    textSecondary,
    textToHighlight,
    onClick
}) => {
    const showCheckbox = isSelected === true || isSelected === false;
    const showSecondaryText = !!textSecondary;
    const showStartIcon = !!iconStartName;
    const showEndIcon = !!iconEndName;
    const showOverflow = !!overflowMenuItems?.length;
    const [menuOpen, setMenuVisible] = useState(false);
    return (
        <>
            <DefaultButton
                styles={buttonStyles}
                onClick={onClick}
                onKeyPress={(event) => {
                    if (event.code === 'Space') {
                        setMenuVisible(!menuOpen);
                    }
                }}
            >
                {showCheckbox && <Checkbox checked={isSelected} />}
                {showStartIcon && (
                    <FontIcon
                        iconName={iconStartName}
                        className={styles.icon}
                    />
                )}
                <Stack className={styles.textContainer}>
                    <span className={styles.primaryText}>
                        {textToHighlight
                            ? Utils.getMarkedHtmlBySearch(
                                  textPrimary,
                                  textToHighlight
                              )
                            : textPrimary}
                    </span>
                    {showSecondaryText && (
                        <span className={styles.secondaryText}>
                            {textSecondary}
                        </span>
                    )}
                </Stack>
                {showEndIcon && (
                    <FontIcon iconName={iconEndName} className={styles.icon} />
                )}
                {showOverflow && (
                    <OverflowMenu
                        index={index}
                        menuProps={{
                            items: overflowMenuItems
                        }}
                        menuOpen={menuOpen}
                        onDismiss={() => setMenuVisible(false)}
                    />
                )}
            </DefaultButton>
        </>
    );
};

interface IOverflowMenuProps {
    menuProps: IContextualMenuProps;
    index: number;
    menuOpen: boolean;
    onDismiss: () => void;
}
const OverflowMenu: React.FC<IOverflowMenuProps> = ({
    menuProps,
    menuOpen,
    onDismiss
}) => {
    return (
        <>
            <Icon iconName="MoreVertical" id={'moreMenuIcon'} />
            <ContextualMenu
                items={menuProps.items}
                hidden={!menuOpen}
                directionalHint={DirectionalHint.bottomLeftEdge}
                target={'#moreMenuIcon'}
                onDismiss={onDismiss}
            ></ContextualMenu>
            {/* <IconButton
                // componentRef={behaviorNotOnSceneEllipsisRef}
                menuIconProps={{
                    iconName: 'MoreVertical',
                    style: {
                        fontWeight: 'bold',
                        fontSize: 18,
                        color: 'var(--cb-color-text-primary)'
                    }
                }}
                data-testid={`moreMenu-${index}`}
                title={'More'} // t('more')
                ariaLabel={'More menu'} // t('more')
                menuProps={menuProps}
                menuTriggerKeyCode={KeyCodes.space}
                open={true}
            ></IconButton> */}
        </>
    );
};
