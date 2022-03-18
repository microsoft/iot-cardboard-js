import {
    ChoiceGroup,
    DefaultButton,
    FocusTrapCallout,
    FontIcon,
    IChoiceGroupOption,
    IColorCellProps,
    IconButton,
    mergeStyleSets,
    SwatchColorPicker
} from '@fluentui/react';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ModelTheme {
    objectColor: string;
    background: string;
    style: string;
}

type ModelThemePickerProps = {
    objectColors: string[];
    backgroundColors: string[];
    themeUpdated: (theme: ModelTheme) => void;
};

const ModelThemePicker: React.FC<ModelThemePickerProps> = ({
    objectColors,
    backgroundColors,
    themeUpdated
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [theme, setTheme] = useState<ModelTheme>(null);
    const [colors, setColors] = useState<IColorCellProps[]>([]);
    const [backgrounds, setBackgrounds] = useState<IColorCellProps[]>([]);
    const calloutAnchor = 'cb-theme-callout-anchor';
    const { t } = useTranslation();

    const styleOptions: IChoiceGroupOption[] = [
        {
            key: 'default',
            imageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/DefaultStyle.png',
            imageAlt: t('modelThemePicker.default'),
            selectedImageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/DefaultStyle.png',
            imageSize: { width: 40, height: 40 },
            text: t('modelThemePicker.default')
        },
        {
            key: 'transparent',
            imageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/TransparentStyle.png',
            imageAlt: t('modelThemePicker.transparent'),
            selectedImageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/TransparentStyle.png',
            imageSize: { width: 40, height: 40 },
            text: t('modelThemePicker.transparent')
        },
        {
            key: 'wireframe',
            imageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/WireframeStyle.png',
            imageAlt: t('modelThemePicker.wireframe'),
            selectedImageSrc:
                'https://cardboardresources.blob.core.windows.net/cardboard-images/WireframeStyle.png',
            imageSize: { width: 40, height: 40 },
            text: t('modelThemePicker.wireframe')
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

        setTheme({
            objectColor: objectColors[0],
            background: backgroundColors[0],
            style: styleOptions[0].key
        });
    }, []);

    useEffect(() => {
        themeUpdated(theme);
    }, [theme]);

    const themeChange = (theme: string) => {
        setTheme(
            produce((draft) => {
                draft.style = theme;
            })
        );
    };

    const updateObjectColor = (objectColor: string) => {
        setTheme(
            produce((draft) => {
                draft.objectColor = objectColor;
            })
        );
    };

    const updateBackgroundColor = (backgroundColor: string) => {
        setTheme(
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
                >
                    <div className={styles.header}>
                        <div>
                            <FontIcon iconName="color" />
                        </div>
                        <div className={styles.title}>
                            {t('modelThemePicker.title')}
                        </div>
                        <div>
                            <IconButton
                                iconProps={{
                                    iconName: 'Cancel',
                                    style: {
                                        fontSize: '14',
                                        height: '32',
                                        color: 'var(--cb-color-text-primary)'
                                    }
                                }}
                                onClick={() => setShowPicker(false)}
                            />
                        </div>
                    </div>
                    <div className={styles.subHeading}>
                        {t('modelThemePicker.style')}
                    </div>
                    <ChoiceGroup
                        defaultSelectedKey={theme.style}
                        options={styleOptions}
                        onChange={(e, option) => themeChange(option.key)}
                    />
                    <div className={styles.subHeading}>
                        {t('modelThemePicker.objectColors')}
                    </div>
                    <div>
                        <SwatchColorPicker
                            cellHeight={40}
                            cellWidth={40}
                            columnCount={colors.length}
                            defaultSelectedId={theme.objectColor}
                            cellShape={'circle'}
                            colorCells={colors}
                            onChange={(e, id, color) =>
                                updateObjectColor(color)
                            }
                        />
                    </div>
                    <div className={styles.subHeading}>
                        {t('modelThemePicker.background')}
                    </div>
                    <div>
                        <SwatchColorPicker
                            cellHeight={40}
                            cellWidth={40}
                            columnCount={backgrounds.length}
                            defaultSelectedId={theme.background}
                            cellShape={'circle'}
                            colorCells={backgrounds}
                            onChange={(e, id, color) =>
                                updateBackgroundColor(color)
                            }
                        />
                    </div>
                </FocusTrapCallout>
            )}
        </div>
    );
};

const styles = mergeStyleSets({
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

export default ModelThemePicker;
