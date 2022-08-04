import {
    ChoiceGroup,
    classNamesFunction,
    FocusTrapCallout,
    FontIcon,
    FontSizes,
    IChoiceGroupOption,
    IColorCellProps,
    IconButton,
    Stack,
    styled,
    SwatchColorPicker,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ViewerObjectStyle } from '../../Models/Constants';
import { IObjectStyleOption } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';
import { getDebugLogger } from '../../Models/Services/Utils';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlButtonWithCallout from '../HeaderControlButtonWithCallout/HeaderControlButtonWithCallout';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';
import { getStyles } from './ModelViewerModePicker.styles';
import {
    IModelViewerModePickerProps,
    IModelViewerModePickerStyleProps,
    IModelViewerModePickerStyles
} from './ModelViewerModePicker.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ModelViewerModePicker', debugLogging);

const getClassNames = classNamesFunction<
    IModelViewerModePickerStyleProps,
    IModelViewerModePickerStyles
>();

const ModelViewerModePicker: React.FC<IModelViewerModePickerProps> = (
    props
) => {
    const {
        backgroundColorOptions,
        objectColorOptions,
        objectStyleOptions,
        onChangeObjectColor,
        onChangeObjectStyle,
        onChangeSceneBackground,
        selectedObjectColor,
        selectedObjectStyle,
        selectedSceneBackground,
        styles
    } = props;

    // state
    const [colors, setColors] = useState<IColorCellProps[]>([]);
    const [backgrounds, setBackgrounds] = useState<IColorCellProps[]>([]);
    const calloutAnchor = 'cb-theme-callout-anchor';

    // hooks
    const { t } = useTranslation();
    const theme = useTheme();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    useEffect(() => {
        const colors: IColorCellProps[] = [];
        objectColorOptions.forEach((oc) => {
            colors.push({ id: oc.color, color: oc.color });
        });

        setColors(colors);

        const backgrounds: IColorCellProps[] = [];
        backgroundColorOptions.forEach((background) => {
            // optimistically try to parse a hex from a radial gradient, gracefully degrade if unable
            let hexBackground = background.color;
            if (background.color.startsWith('radial-gradient')) {
                try {
                    hexBackground = background.color
                        .split('(')[1]
                        .split(' ')[0];
                } catch (error) {
                    console.debug('failed to parse hex from radial gradient');
                }
            }

            backgrounds.push({
                id: background.color,
                color: hexBackground
            });
        });

        setBackgrounds(backgrounds);
        // // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateStyle = useCallback(
        (_e: any, option: IChoiceGroupOption) => {
            onChangeObjectStyle(option.key as ViewerObjectStyle);
        },
        [onChangeObjectStyle]
    );

    const updateObjectColor = useCallback(
        (_e, _id, objectColor: string) => {
            onChangeObjectColor(objectColor);
        },
        [onChangeObjectColor]
    );

    const updateBackgroundColor = useCallback(
        (_e, backgroundColor: string) => {
            onChangeSceneBackground(backgroundColor);
        },
        [onChangeSceneBackground]
    );

    const styleChoiceOptions = useMemo(
        () => mapStylesToOptions(objectStyleOptions),
        [objectStyleOptions]
    );

    logDebugConsole('debug', 'render', props);
    return (
        <div>
            <HeaderControlButtonWithCallout
                buttonProps={{
                    iconName: 'Color',
                    testId: 'scene-theme-picker-button',
                    title: t('modelViewerModePicker.buttonLabel')
                }}
                calloutProps={{
                    iconName: 'Color',
                    title: t('modelViewerModePicker.title')
                }}
            >
                <Stack tokens={{ childrenGap: 8 }}>
                    <h4 className={classNames.subHeader}>
                        {t('modelViewerModePicker.style')}
                    </h4>
                    <ChoiceGroup
                        selectedKey={selectedObjectStyle}
                        options={styleChoiceOptions}
                        onChange={updateStyle}
                    />
                    <h4 className={classNames.subHeader}>
                        {t('modelViewerModePicker.objectColors')}
                    </h4>
                    <div className={classNames.colorPicker}>
                        <SwatchColorPicker
                            disabled={
                                selectedObjectStyle ===
                                ViewerObjectStyle.Default
                            }
                            cellHeight={32}
                            cellWidth={32}
                            columnCount={colors.length}
                            selectedId={selectedObjectColor}
                            cellShape={'circle'}
                            colorCells={colors}
                            onChange={updateObjectColor}
                            getColorGridCellStyles={(props) => {
                                if (props.disabled) {
                                    return {
                                        colorCell: {
                                            opacity: '0.1'
                                        },
                                        svg: null
                                    };
                                }
                            }}
                        />
                    </div>
                    <h4 className={classNames.subHeader}>
                        {t('modelViewerModePicker.background')}
                    </h4>
                    <div className={classNames.colorPicker}>
                        <SwatchColorPicker
                            cellHeight={32}
                            cellWidth={32}
                            columnCount={backgrounds.length}
                            selectedId={selectedSceneBackground}
                            cellShape={'circle'}
                            colorCells={backgrounds}
                            onChange={updateBackgroundColor}
                        />
                    </div>
                </Stack>
            </HeaderControlButtonWithCallout>
        </div>
    );
};

const mapStylesToOptions = (
    styles: IObjectStyleOption[]
): IChoiceGroupOption[] => {
    return styles.map((x) => ({
        ...x,
        styles: {
            innerField: {
                width: 100,
                padding: 0,
                justifyContent: 'center'
            }
        }
    }));
};

export default styled<
    IModelViewerModePickerProps,
    IModelViewerModePickerStyleProps,
    IModelViewerModePickerStyles
>(ModelViewerModePicker, getStyles);
