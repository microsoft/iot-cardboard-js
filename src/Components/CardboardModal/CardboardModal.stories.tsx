import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import CardboardModal from './CardboardModal';
import { ICardboardModalProps } from './CardboardModal.types';
import { TextField } from '@fluentui/react';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CardboardModal',
    component: CardboardModal,
    decorators: [getDefaultStoryDecorator<ICardboardModalProps>(wrapperStyle)]
};

type CardboardModalStory = ComponentStory<typeof CardboardModal>;

const Template: CardboardModalStory = (args) => {
    return (
        <CardboardModal {...args}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Mauris
            cursus mattis molestie a iaculis at erat pellentesque adipiscing.
            Urna nec tincidunt praesent semper feugiat nibh sed. Viverra nibh
            cras pulvinar mattis nunc sed blandit. Nullam non nisi est sit amet.
            Dis parturient montes nascetur ridiculus mus mauris vitae ultricies.
            Pretium lectus quam id leo in vitae. Dictum varius duis at
            consectetur lorem donec. Amet massa vitae tortor condimentum lacinia
            quis vel eros. Risus at ultrices mi tempus imperdiet nulla
            malesuada.
            <TextField label={'Field 1'} placeholder={'Field 1'} />
            <TextField label={'Field 2'} placeholder={'Field 2'} />
            <TextField label={'Field 3'} placeholder={'Field 3'} />
            <TextField label={'Field 4'} placeholder={'Field 4'} />
            <TextField label={'Field 5'} placeholder={'Field 5'} />
            <TextField label={'Field 6'} placeholder={'Field 6'} />
            <TextField label={'Field 7'} placeholder={'Field 7'} />
        </CardboardModal>
    );
};

export const Base = Template.bind({}) as CardboardModalStory;
Base.args = {
    isOpen: true,
    onDismiss: () => alert('closed'),
    primaryButtonProps: {
        text: 'Submit',
        onClick: () => alert('clicked')
    },
    title: 'Header',
    subTitle: 'Sub title'
} as ICardboardModalProps;

export const WithIcon = Template.bind({}) as CardboardModalStory;
WithIcon.args = {
    isOpen: true,
    onDismiss: () => alert('closed'),
    primaryButtonProps: {
        text: 'Submit',
        onClick: () => alert('clicked')
    },
    title: 'Header',
    titleIconName: 'CubeShape',
    subTitle: 'Sub title'
} as ICardboardModalProps;

export const WithDestructive = Template.bind({}) as CardboardModalStory;
WithDestructive.args = {
    destructiveButtonProps: {
        text: 'Destroy',
        onClick: () => {
            'destroy';
        }
    },
    isOpen: true,
    onDismiss: () => alert('closed'),
    primaryButtonProps: {
        text: 'Submit',
        onClick: () => alert('clicked')
    },
    title: 'Header',
    subTitle: 'Sub title'
} as ICardboardModalProps;

export const WithCustomElements = Template.bind({}) as CardboardModalStory;
WithCustomElements.args = {
    isOpen: true,
    onDismiss: () => alert('closed'),
    primaryButtonProps: {
        text: 'Submit',
        onClick: () => alert('clicked')
    },
    title: () => <div style={{ color: 'red' }}>Custom title</div>,
    subTitle: () => <div style={{ color: 'blue' }}>custom styled sub title</div>
} as ICardboardModalProps;
