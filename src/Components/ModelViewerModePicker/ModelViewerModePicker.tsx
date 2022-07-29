import {
    ChoiceGroup,
    FocusTrapCallout,
    FontIcon,
    FontSizes,
    IChoiceGroupOption,
    IColorCellProps,
    IconButton,
    memoizeFunction,
    mergeStyleSets,
    SwatchColorPicker,
    Theme,
    useTheme
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IADTBackgroundColor,
    IADTObjectColor,
    ViewerObjectStyle
} from '../../Models/Constants';
import { IObjectStyleOption } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';
import { getDebugLogger } from '../../Models/Services/Utils';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ModelViewerModePicker', debugLogging);

interface ModelViewerModePickerProps {
    selectedObjectColor: string;
    selectedObjectStyle: ViewerObjectStyle;
    selectedSceneBackground: string;
    objectColorOptions: IADTObjectColor[];
    backgroundColorOptions: IADTBackgroundColor[];
    objectStyleOptions: IObjectStyleOption[];
    onChangeObjectColor: (value: string) => void;
    onChangeObjectStyle: (value: ViewerObjectStyle) => void;
    onChangeSceneBackground: (value: string) => void;
}

const ModelViewerModePicker: React.FC<ModelViewerModePickerProps> = (props) => {
    const {
        backgroundColorOptions,
        objectColorOptions,
        objectStyleOptions,
        onChangeObjectColor,
        onChangeObjectStyle,
        onChangeSceneBackground,
        selectedObjectColor,
        selectedObjectStyle,
        selectedSceneBackground
    } = props;
    const [showPicker, { toggle: togglePicker }] = useBoolean(false);
    const [colors, setColors] = useState<IColorCellProps[]>([]);
    const [backgrounds, setBackgrounds] = useState<IColorCellProps[]>([]);
    const calloutAnchor = 'cb-theme-callout-anchor';
    const { t } = useTranslation();
    const theme = useTheme();
    const styles = getStyles(theme);

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
            <HeaderControlGroup>
                <HeaderControlButton
                    dataTestId="scene-theme-picker-button"
                    iconProps={{ iconName: 'Color' }}
                    id={calloutAnchor}
                    onClick={togglePicker}
                    title={t('modelViewerModePicker.buttonLabel')}
                    isActive={showPicker}
                />
            </HeaderControlGroup>
            {showPicker && (
                <FocusTrapCallout
                    focusTrapProps={{
                        isClickableOutsideFocusTrap: true
                    }}
                    target={`#${calloutAnchor}`}
                    onDismiss={togglePicker}
                    backgroundColor={theme.semanticColors.bodyBackground}
                >
                    <div className={styles.calloutContent}>
                        <div className={styles.header}>
                            <div>
                                <FontIcon iconName="color" />
                            </div>
                            <div className={styles.title}>
                                {t('modelViewerModePicker.title')}
                            </div>
                            <div>
                                <IconButton
                                    iconProps={{
                                        iconName: 'Cancel',
                                        style: {
                                            fontSize: FontSizes.size14
                                        }
                                    }}
                                    onClick={togglePicker}
                                />
                            </div>
                        </div>
                        <h4 className={styles.subHeading}>
                            {t('modelViewerModePicker.style')}
                        </h4>
                        <ChoiceGroup
                            selectedKey={selectedObjectStyle}
                            options={styleChoiceOptions}
                            onChange={updateStyle}
                        />
                        <h4 className={styles.subHeading}>
                            {t('modelViewerModePicker.objectColors')}
                        </h4>
                        <div className={styles.colorPicker}>
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
                        <h4 className={styles.subHeading}>
                            {t('modelViewerModePicker.background')}
                        </h4>
                        <div className={styles.colorPicker}>
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
                    </div>
                </FocusTrapCallout>
            )}
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

const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        calloutContent: {
            padding: '12px'
        },
        header: {
            display: 'flex',
            lineHeight: '32px',
            verticalAlign: 'middle',
            fontSize: '16'
        },
        title: {
            marginLeft: '12px',
            fontWeight: '500',
            flex: '1'
        },
        subHeading: {
            fontSize: '12',
            fontWeight: '500',
            marginTop: '12px',
            marginBottom: '12px'
        },
        colorPicker: {
            height: '45px',
            display: 'flex',
            alignItems: 'center'
        }
    });
});

export default ModelViewerModePicker;
