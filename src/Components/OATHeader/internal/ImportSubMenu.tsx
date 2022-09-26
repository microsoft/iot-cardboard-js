import React from 'react';
import {
    ActionButton,
    Text,
    Callout,
    useTheme,
    classNamesFunction,
    styled
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IImportSubMenuProps,
    IImportSubMenuStyleProps,
    IImportSubMenuStyles
} from './ImportSubMenu.types';
import { getStyles } from './FileSubMenu.styles';

const getClassNames = classNamesFunction<
    IImportSubMenuStyleProps,
    IImportSubMenuStyles
>();

const ImportSubMenu: React.FC<IImportSubMenuProps> = (props) => {
    const {
        setSubMenuActive,
        styles,
        isActive,
        targetId,
        uploadFile,
        uploadFolder
    } = props;
    // hooks
    const { t } = useTranslation();

    // callbacks
    const onUploadFile = () => {
        uploadFile && uploadFile();
        setSubMenuActive(false);
    };

    const onUploadFolder = () => {
        uploadFolder && uploadFolder();
        setSubMenuActive(false);
    };

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme(),
        isMenuOpen: isActive
    });

    return (
        <>
            {isActive && (
                <Callout
                    styles={classNames.subComponentStyles.subMenuCallout}
                    role="dialog"
                    gapSpace={0}
                    target={`#${targetId}`}
                    isBeakVisible={false}
                    setInitialFocus
                    onDismiss={() => setSubMenuActive(false)}
                >
                    <ActionButton
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={onUploadFile}
                    >
                        <Text>{t('OATHeader.importFile')}</Text>
                    </ActionButton>

                    <ActionButton
                        styles={classNames.subComponentStyles.menuItemButton()}
                        onClick={onUploadFolder}
                    >
                        <Text>{t('OATHeader.importFolder')}</Text>
                    </ActionButton>
                </Callout>
            )}
        </>
    );
};

export default styled<
    IImportSubMenuProps,
    IImportSubMenuStyleProps,
    IImportSubMenuStyles
>(ImportSubMenu, getStyles);
