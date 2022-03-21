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
import DefaultStyle from './Assets/default.svg';
import TransparentStyle from './Assets/transparent.svg';
import WireframeStyle from './Assets/wireframe.svg';

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
            imageSrc: DefaultStyle,
            imageAlt: t('modelThemePicker.default'),
            selectedImageSrc: DefaultStyle,
            imageSize: { width: 40, height: 40 },
            text: t('modelThemePicker.default')
        },
        {
            key: 'transparent',
            imageSrc: TransparentStyle,
            imageAlt: t('modelThemePicker.transparent'),
            selectedImageSrc: TransparentStyle,
            imageSize: { width: 40, height: 40 },
            text: t('modelThemePicker.transparent')
        },
        {
            key: 'wireframe',
            imageSrc: WireframeStyle,
            imageAlt: t('modelThemePicker.wireframe'),
            selectedImageSrc: WireframeStyle,
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

    const updateStyle = (theme: string) => {
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
                    <h4 className={styles.subHeading}>
                        {t('modelThemePicker.style')}
                    </h4>
                    <ChoiceGroup
                        defaultSelectedKey={theme.style}
                        options={styleOptions}
                        onChange={(e, option) => updateStyle(option.key)}
                    />
                    <h4 className={styles.subHeading}>
                        {t('modelThemePicker.objectColors')}
                    </h4>
                    <SwatchColorPicker
                        cellHeight={32}
                        cellWidth={32}
                        columnCount={colors.length}
                        defaultSelectedId={theme.objectColor}
                        cellShape={'circle'}
                        colorCells={colors}
                        onChange={(e, id, color) => updateObjectColor(color)}
                    />
                    <h4 className={styles.subHeading}>
                        {t('modelThemePicker.background')}
                    </h4>
                    <SwatchColorPicker
                        cellHeight={32}
                        cellWidth={32}
                        columnCount={backgrounds.length}
                        defaultSelectedId={theme.background}
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
