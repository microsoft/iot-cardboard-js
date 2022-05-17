import {
    ChoiceGroup,
    FocusTrapCallout,
    FontIcon,
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
import produce from 'immer';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IADTBackgroundColor, ViewerObjectStyle } from '../../Models/Constants';
import { ViewerMode } from '../../Models/Context/ColorContext/ColorContext.types';
import DefaultStyle from '../../Resources/Static/default.svg';
import TransparentStyle from '../../Resources/Static/transparent.svg';
import WireframeStyle from '../../Resources/Static/wireframe.svg';
import HeaderControlButton from '../HeaderControlButton/HeaderControlButton';
import HeaderControlGroup from '../HeaderControlGroup/HeaderControlGroup';

interface ModelViewerModePickerProps {
    objectColors: any[];
    backgroundColors: IADTBackgroundColor[];
    defaultViewerMode?: ViewerMode;
    viewerModeUpdated: (viewerMode: ViewerMode) => void;
}

const ModelViewerModePicker: React.FC<ModelViewerModePickerProps> = ({
    objectColors,
    backgroundColors,
    defaultViewerMode,
    viewerModeUpdated
}) => {
    const [showPicker, { toggle: togglePicker }] = useBoolean(false);
    const [viewerMode, setViewerMode] = useState<ViewerMode>(null);
    const [colors, setColors] = useState<IColorCellProps[]>([]);
    const [backgrounds, setBackgrounds] = useState<IColorCellProps[]>([]);
    const [selectedObjectColor, setSelectedObjectColor] = useState<string>(
        objectColors[0].color
    );
    const calloutAnchor = 'cb-theme-callout-anchor';
    const { t } = useTranslation();
    const theme = useTheme();
    const styles = getStyles(theme);

    const options: IChoiceGroupOption[] = useMemo(
        () => [
            {
                key: ViewerObjectStyle.Default,
                imageSrc: DefaultStyle,
                imageAlt: t('modelViewerModePicker.default'),
                selectedImageSrc: DefaultStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.default'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            },
            {
                key: ViewerObjectStyle.Transparent,
                imageSrc: TransparentStyle,
                imageAlt: t('modelViewerModePicker.transparent'),
                selectedImageSrc: TransparentStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.transparent'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            },
            {
                key: ViewerObjectStyle.Wireframe,
                imageSrc: WireframeStyle,
                imageAlt: t('modelViewerModePicker.wireframe'),
                selectedImageSrc: WireframeStyle,
                imageSize: { width: 40, height: 40 },
                text: t('modelViewerModePicker.wireframe'),
                styles: {
                    innerField: {
                        width: 100,
                        padding: 0,
                        justifyContent: 'center'
                    }
                }
            }
        ],
        [t]
    );

    useEffect(() => {
        const colors: IColorCellProps[] = [];
        objectColors.forEach((oc) => {
            colors.push({ id: oc.color, color: oc.color });
        });

        setColors(colors);

        const backgrounds: IColorCellProps[] = [];
        backgroundColors.forEach((background) => {
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
        setSelectedObjectColor(objectColors[0].color);

        setViewerMode({
            objectColor: null,
            sceneBackground: backgroundColors[0].color,
            objectStyle: ViewerObjectStyle.Default
        });

        viewerModeUpdated({
            objectColor: null,
            sceneBackground: backgroundColors[0].color,
            objectStyle: ViewerObjectStyle.Default
        });
    }, []);

    useEffect(() => {
        if (defaultViewerMode) {
            setViewerMode({
                objectColor:
                    defaultViewerMode?.objectStyle !== ViewerObjectStyle.Default
                        ? defaultViewerMode.objectColor
                        : null,
                sceneBackground: defaultViewerMode.sceneBackground,
                objectStyle: defaultViewerMode.objectStyle
            });

            setSelectedObjectColor(
                defaultViewerMode?.objectStyle !== ViewerObjectStyle.Default
                    ? defaultViewerMode.objectColor
                    : objectColors[0].color
            );
        }
    }, [defaultViewerMode]);

    const updateStyle = (style: ViewerObjectStyle) => {
        setViewerMode(
            produce((draft) => {
                if (style === ViewerObjectStyle.Default) {
                    draft.objectColor = null;
                } else {
                    draft.objectColor = selectedObjectColor;
                }
                draft.objectStyle = style;

                viewerModeUpdated({
                    objectColor: draft.objectColor,
                    sceneBackground: draft.sceneBackground,
                    objectStyle: draft.objectStyle
                });
            })
        );
    };

    const updateObjectColor = (objectColor: string) => {
        setViewerMode(
            produce((draft) => {
                if (draft.objectStyle === ViewerObjectStyle.Default) {
                    draft.objectColor = null;
                } else {
                    draft.objectColor = objectColor;
                }

                viewerModeUpdated({
                    objectColor: draft.objectColor,
                    sceneBackground: draft.sceneBackground,
                    objectStyle: draft.objectStyle
                });
            })
        );

        setSelectedObjectColor(objectColor);
    };

    const updateBackgroundColor = (backgroundColor: string) => {
        setViewerMode(
            produce((draft) => {
                draft.sceneBackground = backgroundColor;

                viewerModeUpdated({
                    objectColor: draft.objectColor,
                    sceneBackground: draft.sceneBackground,
                    objectStyle: draft.objectStyle
                });
            })
        );
    };

    return (
        <div>
            <HeaderControlGroup>
                <HeaderControlButton
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
                                            fontSize: '14',
                                            height: '32'
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
                            defaultSelectedKey={viewerMode?.objectStyle}
                            options={options}
                            onChange={(e, option) =>
                                updateStyle(option.key as ViewerObjectStyle)
                            }
                        />
                        <h4 className={styles.subHeading}>
                            {t('modelViewerModePicker.objectColors')}
                        </h4>
                        <div className={styles.colorPicker}>
                            <SwatchColorPicker
                                disabled={
                                    viewerMode?.objectStyle ===
                                    ViewerObjectStyle.Default
                                }
                                cellHeight={32}
                                cellWidth={32}
                                columnCount={colors.length}
                                defaultSelectedId={
                                    viewerMode?.objectColor
                                        ? viewerMode.objectColor
                                        : selectedObjectColor
                                }
                                cellShape={'circle'}
                                colorCells={colors}
                                onChange={(e, id, color) =>
                                    updateObjectColor(color)
                                }
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
                                defaultSelectedId={viewerMode?.sceneBackground}
                                cellShape={'circle'}
                                colorCells={backgrounds}
                                onChange={(e, id) => updateBackgroundColor(id)}
                            />
                        </div>
                    </div>
                </FocusTrapCallout>
            )}
        </div>
    );
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
