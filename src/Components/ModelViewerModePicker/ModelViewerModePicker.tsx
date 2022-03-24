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
    objectColors: any[];
    backgroundColors: string[];
    viewerModeUpdated: (viewerMode: ViewerMode) => void;
}

const ModelViewerModePicker: React.FC<ModelViewerModePickerProps> = ({
    objectColors,
    backgroundColors,
    viewerModeUpdated
}) => {
    const [showPicker, setShowPicker] = useState(false);
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
        objectColors.forEach((oc) => {
            colors.push({ id: oc.color, color: oc.color });
        });

        setColors(colors);

        const backgrounds: IColorCellProps[] = [];
        backgroundColors.forEach((background) => {
            // optimistically try to parse a hex from a radial gradient, gracefully degrade if unable
            let hexBackground = background;
            if (background.startsWith('radial-gradient')) {
                try {
                    hexBackground = background.split('(')[1].split(' ')[0];
                } catch (error) {
                    console.debug('failed to parse hex from radial gradient');
                }
            }

            backgrounds.push({
                id: background,
                color: hexBackground
            });
        });

        setBackgrounds(backgrounds);

        setViewerMode({
            objectColor: null,
            background: backgroundColors[0],
            style: styleOptions[0].key
        });
    }, []);

    useEffect(() => {
        viewerModeUpdated(viewerMode);
    }, [viewerMode]);

    const updateStyle = (style: string) => {
        setViewerMode(
            produce((draft) => {
                if (style === 'default') {
                    draft.objectColor = null;
                } else {
                    draft.objectColor = selectedObjectColor;
                }
                draft.style = style;
            })
        );
    };

    const updateObjectColor = (objectColor: string) => {
        setViewerMode(
            produce((draft) => {
                if (draft.style === 'default') {
                    draft.objectColor = null;
                } else {
                    draft.objectColor = objectColor;
                }
            })
        );

        setSelectedObjectColor(objectColor);
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
                    target={`#${calloutAnchor}`}
                    isBeakVisible={false}
                    onDismiss={() => setShowPicker(false)}
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
                        <div className={styles.colorPicker}>
                            <SwatchColorPicker
                                disabled={viewerMode.style === 'default'}
                                cellHeight={32}
                                cellWidth={32}
                                columnCount={colors.length}
                                defaultSelectedId={colors[0].id}
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
                                defaultSelectedId={viewerMode.background}
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
