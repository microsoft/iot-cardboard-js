import React from 'react';
import { ComponentStory } from '@storybook/react';
import { useBoolean } from '@fluentui/react-hooks';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CommandBarMenu from './CommandBarMenu';
import {
    ICommandBarMenuItemType,
    ICommandBarMenuProps
} from './CommandBarMenu.types';
import { CommandBar } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CommandBarMenu',
    component: CommandBarMenu,
    decorators: [getDefaultStoryDecorator<ICommandBarMenuProps>(wrapperStyle)]
};

type CommandBarMenuStory = ComponentStory<typeof CommandBarMenu>;

const Template: CommandBarMenuStory = (args) => {
    const [isOpen, { toggle: toggleIsOpen }] = useBoolean(args.isMenuOpen);
    return (
        <>
            <CommandBar
                items={[
                    {
                        iconProps: { iconName: 'FabricFolder' },
                        id: args.targetId,
                        key: 'firstButton',
                        onClick: toggleIsOpen,
                        text: 'Click me'
                    }
                ]}
            />
            <CommandBarMenu
                {...args}
                isMenuOpen={isOpen}
                onMenuClose={toggleIsOpen}
            />
        </>
    );
};

export const Base = Template.bind({}) as CommandBarMenuStory;
Base.args = {
    isMenuOpen: true,
    items: [
        {
            key: 'newFile',
            text: 'New file',
            onClick: () => alert('new file'),
            iconProps: { iconName: 'Add' },
            menuItemType: ICommandBarMenuItemType.Button
        },
        {
            key: 'save',
            text: 'Save',
            onClick: () => alert('Saved'),
            iconProps: { iconName: 'Save' },
            menuItemType: ICommandBarMenuItemType.Button
        },
        {
            key: 'divider1',
            menuItemType: ICommandBarMenuItemType.Divider
        },
        {
            key: 'delete',
            text: 'Delete',
            onClick: () => alert('Delete'),
            iconProps: { iconName: 'Delete' },
            menuItemType: ICommandBarMenuItemType.Button
        }
    ],
    targetId: 'testButtonId',
    onMenuClose: () => undefined // overridden by the base component here
} as ICommandBarMenuProps;
