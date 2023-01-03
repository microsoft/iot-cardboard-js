import { ITheme } from '@fluentui/react';
import { IPickerOption } from '../Components/Pickers/Internal/Picker.base.types';
import { Theme } from '../Models/Constants/Enums';
import { IExtendedPartialPalette } from './Theme.types';

export const getPrimaryButtonCustomOverrides = (
    themeSetting: Theme,
    theme: ITheme
) => {
    return {
        // Adds box shadow on light theme
        boxShadow:
            themeSetting === Theme.Light
                ? `0 1px 3px 0 rgba(0, 0, 0, .12)`
                : '0 1px 3px 0 rgba(255,255,255,.12)',
        primaryButtonTextColor:
            themeSetting === Theme.Kraken ? theme.palette.white : '#F2F3F4',
        primaryButtonTextColorDisabled:
            themeSetting === Theme.Dark
                ? '#F2F3F4'
                : theme.semanticColors.buttonTextDisabled
    };
};

export const defaultSwatchColors: IPickerOption[] = [
    { id: 'blue', label: 'blue', item: '#33A1FD' },
    { id: 'green', label: 'green', item: '#26C485' },
    { id: 'yellow', label: 'yellow', item: '#FEE440' },
    { id: 'orange', label: 'orange', item: '#F79824' },
    { id: 'red', label: 'red', item: '#C32F27' },
    { id: 'pink', label: 'pink', item: '#EE92C2' }
];
export const defaultSwatchIcons: IPickerOption[] = [
    {
        id: 'FastForward',
        item: 'FastForward'
    },
    {
        id: 'Asterisk',
        item: 'Asterisk'
    },
    {
        id: 'Frigid',
        item: 'Frigid'
    },
    {
        id: 'RedEye',
        item: 'RedEye'
    },
    {
        id: 'Ringer',
        item: 'Ringer'
    },
    {
        id: 'Stopwatch',
        item: 'Stopwatch'
    },
    {
        id: 'SpeedHigh',
        item: 'SpeedHigh'
    },
    {
        id: 'Shield',
        item: 'Shield'
    },
    {
        id: 'Accept',
        item: 'Accept'
    },
    {
        id: 'Warning',
        item: 'Warning'
    },
    {
        id: 'Lightbulb',
        item: 'Lightbulb'
    }
];

// Palettes created from https://aka.ms/themedesigner
export const fluentLightThemePalette: IExtendedPartialPalette = {
    themePrimary: '#0078d4',
    themeLighterAlt: '#eff6fc',
    themeLighter: '#deecf9',
    themeLight: '#c7e0f4',
    themeTertiary: '#71afe5',
    themeSecondary: '#2b88d8',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
    neutralQuaternaryAlt: '#e1dfdd',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c6c4',
    neutralTertiary: '#a19f9d',
    neutralSecondary: '#605e5c',
    neutralPrimaryAlt: '#3b3a39',
    neutralPrimary: '#323130',
    neutralDark: '#201f1e',
    black: '#000000',
    white: '#ffffff',
    // custom colors
    glassyBackground75: '#faf9f8bf',
    glassyBackground90: '#faf9f8e6',
    glassyBorder: '#d3d3d3',
    errorTextLight: '#cb2431'
};

export const fluentDarkThemePalette: IExtendedPartialPalette = {
    themePrimary: '#058bf2',
    themeLighterAlt: '#00060a',
    themeLighter: '#011627',
    themeLight: '#012a49',
    themeTertiary: '#035491',
    themeSecondary: '#047bd5',
    themeDarkAlt: '#1d96f4',
    themeDark: '#3fa6f5',
    themeDarker: '#70bdf8',
    neutralLighterAlt: '#0d0f0e',
    neutralLighter: '#0d0f0e',
    neutralLight: '#0c0e0d',
    neutralQuaternaryAlt: '#0b0d0c',
    neutralQuaternary: '#0b0c0c',
    neutralTertiaryAlt: '#5e5e5e',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#0d0f0e',
    // custom colors
    glassyBackground75: '#040404bf',
    glassyBackground90: '#040404e6',
    glassyBorder: '#424242',
    errorTextLight: '#f85149'
};

export const fluentExplorerThemePalette: IExtendedPartialPalette = {
    themePrimary: '#60aaff',
    themeLighterAlt: '#f9fcff',
    themeLighter: '#e6f2ff',
    themeLight: '#d0e6ff',
    themeTertiary: '#a0ccff',
    themeSecondary: '#74b5ff',
    themeDarkAlt: '#579ae6',
    themeDark: '#4a82c2',
    themeDarker: '#36608f',
    neutralLighterAlt: '#2b2b2b',
    neutralLighter: '#333333',
    neutralLight: '#414141',
    neutralQuaternaryAlt: '#4a4a4a',
    neutralQuaternary: '#515151',
    neutralTertiaryAlt: '#6f6f6f',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#222222',
    // custom colors
    glassyBackground75: '#404040bf',
    glassyBackground90: '#404040e6',
    glassyBorder: '#777',
    errorTextLight: '#f85149'
};

export const fluentKrakenThemePalette: IExtendedPartialPalette = {
    themePrimary: '#52baed',
    themeLighterAlt: '#030709',
    themeLighter: '#0d1e26',
    themeLight: '#193847',
    themeTertiary: '#326f8e',
    themeSecondary: '#49a3d1',
    themeDarkAlt: '#63c0ef',
    themeDark: '#7acaf1',
    themeDarker: '#9cd7f5',
    neutralLighterAlt: '#1c2746',
    neutralLighter: '#212c4d',
    neutralLight: '#293659',
    neutralQuaternaryAlt: '#2f3c61',
    neutralQuaternary: '#344267',
    neutralTertiaryAlt: '#4c5a81',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#16203c',
    // custom colors
    glassyBackground75: '#1e2c53bf',
    glassyBackground90: '#1e2c53e6',
    glassyBorder: '#303d5c',
    errorTextLight: '#f85149'
};
