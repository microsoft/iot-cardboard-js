import {
    ChoiceGroup,
    DefaultButton,
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
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DefaultStyle from '../../Resources/Static/default.svg';
import TransparentStyle from '../../Resources/Static/transparent.svg';
import WireframeStyle from '../../Resources/Static/wireframe.svg';

export interface ViewerMode {
    objectColor: string;
    background: string;
    style: string;
}

interface ModelViewerModePickerProps {
    objectColors: string[];
    backgroundColors: string[];
    themeUpdated: (theme: ViewerMode) => void;
}

const ModelViewerModePicker: React.FC<ModelViewerModePickerProps> = ({
    objectColors,
    backgroundColors,
    themeUpdated
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [viewerMode, setViewerMode] = useState<ViewerMode>(null);
    const [colors, setColors] = useState<IColorCellProps[]>([]);
    const [backgrounds, setBackgrounds] = useState<IColorCellProps[]>([]);
    const calloutAnchor = 'cb-theme-callout-anchor';
    const { t } = useTranslation();
    const theme = useTheme();
    const styles = getStyles(theme);

    const styleOptions: IChoiceGroupOption[] = [
        {
            key: 'default',
            imageSrc: DefaultStyle,
            imageAlt: t('modelViewerModePicker.default'),
            selectedImageSrc: DefaultStyle,
            imageSize: { width: 40, height: 40 },
            text: t('modelViewerModePicker.default')
        },
        {
            key: 'transparent',
            imageSrc: TransparentStyle,
            imageAlt: t('modelViewerModePicker.transparent'),
            selectedImageSrc: TransparentStyle,
            imageSize: { width: 40, height: 40 },
            text: t('modelViewerModePicker.transparent')
        },
        {
            key: 'wireframe',
            imageSrc: WireframeStyle,
            imageAlt: t('modelViewerModePicker.wireframe'),
            selectedImageSrc: WireframeStyle,
            imageSize: { width: 40, height: 40 },
            text: t('modelViewerModePicker.wireframe')
        }
    ];

    useEffect(() => {
        const colors: IColorCellProps[] = [];
        objectColors.forEach((color) => {
            colors.push({ id: color, color: color });
        });

        setColors(colors);

        const backgrounds: IColorCellProps[] = [];
        backgroundColors.forEach((background) => {
            backgrounds.push({ id: background, color: background });
        });

        setBackgrounds(backgrounds);

        setViewerMode({
            objectColor: objectColors[0],
            background: backgroundColors[0],
            style: styleOptions[0].key
        });
    }, []);

    useEffect(() => {
        themeUpdated(viewerMode);
    }, [viewerMode]);

    const updateStyle = (theme: string) => {
        setViewerMode(
            produce((draft) => {
                draft.style = theme;
            })
        );
    };

    const updateObjectColor = (objectColor: string) => {
        setViewerMode(
            produce((draft) => {
                draft.objectColor = objectColor;
            })
        );
    };

    const updateBackgroundColor = (backgroundColor: string) => {
        setViewerMode(
            produce((draft) => {
                draft.background = backgroundColor;
            })
        );
    };

    return (
        <div>
            <DefaultButton
                iconProps={{ iconName: 'Color' }}
                onClick={() => setShowPicker(true)}
                id={calloutAnchor}
            >
                Theme
            </DefaultButton>
            {showPicker && (
                <FocusTrapCallout
                    gapSpace={12}
                    focusTrapProps={{
                        isClickableOutsideFocusTrap: true
                    }}
                    className={styles.callout}
                    target={`#${calloutAnchor}`}
                    isBeakVisible={false}
                    onDismiss={() => setShowPicker(false)}
                    backgroundColor={theme.semanticColors.bodyBackground}
                >
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
                                onClick={() => setShowPicker(false)}
                            />
                        </div>
                    </div>
                    <h4 className={styles.subHeading}>
                        {t('modelViewerModePicker.style')}
                    </h4>
                    <ChoiceGroup
                        defaultSelectedKey={viewerMode.style}
                        options={styleOptions}
                        onChange={(e, option) => updateStyle(option.key)}
                    />
                    <h4 className={styles.subHeading}>
                        {t('modelViewerModePicker.objectColors')}
                    </h4>
                    <SwatchColorPicker
                        cellHeight={32}
                        cellWidth={32}
                        columnCount={colors.length}
                        defaultSelectedId={viewerMode.objectColor}
                        cellShape={'circle'}
                        colorCells={colors}
                        onChange={(e, id, color) => updateObjectColor(color)}
                    />
                    <h4 className={styles.subHeading}>
                        {t('modelViewerModePicker.background')}
                    </h4>
                    <SwatchColorPicker
                        cellHeight={32}
                        cellWidth={32}
                        columnCount={backgrounds.length}
                        defaultSelectedId={viewerMode.background}
                        cellShape={'circle'}
                        colorCells={backgrounds}
                        onChange={(e, id, color) =>
                            updateBackgroundColor(color)
                        }
                    />
                </FocusTrapCallout>
            )}
        </div>
    );
};

const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        callout: {
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
        }
    });
});

export default ModelViewerModePicker;
