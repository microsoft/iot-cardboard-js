import {
    ChoiceGroup,
    DefaultButton,
    FocusTrapCallout,
    FontIcon,
    IChoiceGroupOption,
    IconButton,
    mergeStyleSets
} from '@fluentui/react';
import produce from 'immer';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface ModelTheme {
    objectColor: string;
    background: string;
    theme: string;
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
        setTheme({
            objectColor: objectColors[0],
            background: backgroundColors[0],
            theme: styleOptions[0].key
        });
    }, []);

    useEffect(() => {
        themeUpdated(theme);
    }, [theme]);

    const themeChange = (theme: string) => {
        setTheme(
            produce((draft) => {
                draft.theme = theme;
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
                        <div className={styles.titleIcon}>
                            <FontIcon iconName="color" />
                        </div>
                        <div className={styles.title}>
                            {t('modelThemePicker.title')}
                        </div>
                        <div className={styles.titleIcon}>
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
                        defaultSelectedKey="default"
                        options={styleOptions}
                        onChange={(e, option) => themeChange(option.key)}
                    />
                    <div className={styles.subHeading}>
                        {t('modelThemePicker.objectColors')}
                    </div>
                    <div>
                        <div className={styles.colors}>
                            {objectColors?.map((objectColor) => (
                                <div key={objectColor}>
                                    {objectColor !== theme.objectColor ? (
                                        <div
                                            className={styles.color}
                                            style={{
                                                background: objectColor
                                            }}
                                            onClick={() =>
                                                updateObjectColor(objectColor)
                                            }
                                        />
                                    ) : (
                                        <div
                                            className={
                                                styles.colorSelectedContainer
                                            }
                                        >
                                            <div
                                                className={styles.colorSelected}
                                                style={{
                                                    background: objectColor
                                                }}
                                                onClick={() =>
                                                    updateObjectColor(
                                                        objectColor
                                                    )
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.subHeading}>
                        {t('modelThemePicker.background')}
                    </div>
                    <div className={styles.colors}>
                        {backgroundColors?.map((backgroundColor) => (
                            <div key={backgroundColor}>
                                {backgroundColor !== theme.background ? (
                                    <div
                                        className={styles.color}
                                        style={{
                                            background: backgroundColor
                                        }}
                                        onClick={() =>
                                            updateBackgroundColor(
                                                backgroundColor
                                            )
                                        }
                                    />
                                ) : (
                                    <div
                                        className={
                                            styles.colorSelectedContainer
                                        }
                                    >
                                        <div
                                            className={styles.colorSelected}
                                            style={{
                                                background: backgroundColor
                                            }}
                                            onClick={() =>
                                                updateBackgroundColor(
                                                    backgroundColor
                                                )
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </FocusTrapCallout>
            )}
        </div>
    );
};

const styles = mergeStyleSets({
    callout: {
        padding: '12px',
        height: '400px'
    },
    header: {
        display: 'flex',
        lineHeight: '32px',
        verticalAlign: 'middle',
        fontSize: '16'
    },
    titleIcon: {},
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
    colors: {
        display: 'flex',
        alignItems: 'center'
    },
    color: {
        borderRadius: '50%',
        height: '36px',
        width: '36px',
        marginRight: '8px',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: 'var(--cb-color-text-primary)',
        cursor: 'pointer'
    },
    colorSelectedContainer: {
        borderRadius: '50%',
        height: '36px',
        width: '36px',
        marginRight: '8px',
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: 'var(--cb-color-theme-primary)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    colorSelected: {
        borderRadius: '50%',
        width: 'calc(100% - 8px)',
        height: 'calc(100% - 8px)',
        cursor: 'pointer'
    }
});

export default ModelThemePicker;
