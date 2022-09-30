import React from 'react';
import {
    classNamesFunction,
    useTheme,
    styled,
    DefaultButton,
    Icon,
    Modal,
    PrimaryButton,
    Stack,
    IStackTokens
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import {
    ICardboardModalProps,
    ICardboardModalStyleProps,
    ICardboardModalStyles
} from './CardboardModal.types';
import { getStyles } from './CardboardModal.styles';
import { useTranslation } from 'react-i18next';

const stackTokens: IStackTokens = { childrenGap: 8 };

const getClassNames = classNamesFunction<
    ICardboardModalStyleProps,
    ICardboardModalStyles
>();

const CardboardModal: React.FC<ICardboardModalProps> = (props) => {
    const {
        contentStackProps,
        children,
        dangerButtonProps,
        isOpen,
        modalProps,
        onDismiss,
        primaryButtonProps,
        styles,
        subTitle,
        title,
        titleIconName
    } = props;

    // hooks
    const { t } = useTranslation();
    const titleId = useId('modal-title');

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme(),
        isDestructiveFooterActionVisible: !!dangerButtonProps
    });

    return (
        <Modal
            {...modalProps}
            isOpen={isOpen}
            titleAriaId={titleId}
            onDismiss={onDismiss}
            styles={classNames.subComponentStyles.modal}
        >
            <Stack
                {...contentStackProps}
                tokens={{ ...stackTokens, ...contentStackProps.tokens }}
                style={{ height: '100%', ...contentStackProps.style }}
            >
                <div className={classNames.headerContainer}>
                    <div className={classNames.titleContainer}>
                        {titleIconName && (
                            <Icon
                                iconName={titleIconName}
                                styles={classNames.subComponentStyles.icon}
                            />
                        )}
                        <h3 id={titleId} className={classNames.title}>
                            {typeof title === 'function' ? title() : title}
                        </h3>
                    </div>
                    {subTitle && (
                        <p className={classNames.subtitle}>
                            {typeof subTitle === 'function'
                                ? subTitle()
                                : subTitle}
                        </p>
                    )}
                </div>
                <div className={classNames.content}>
                    <Stack tokens={stackTokens}>{children}</Stack>
                </div>
                <div className={classNames.footer}>
                    <Stack
                        horizontal
                        tokens={stackTokens}
                        styles={classNames.subComponentStyles.footerStack}
                    >
                        {dangerButtonProps && (
                            <PrimaryButton
                                {...dangerButtonProps}
                                styles={classNames.subComponentStyles.destructiveButton()}
                            />
                        )}
                        <Stack
                            tokens={stackTokens}
                            horizontal
                            horizontalAlign={'end'}
                        >
                            <DefaultButton
                                text={t('cancel')}
                                onClick={onDismiss}
                                styles={classNames.subComponentStyles.cancelButton?.()}
                            />
                            <PrimaryButton
                                {...primaryButtonProps}
                                styles={classNames.subComponentStyles.primaryButton?.()}
                            />
                        </Stack>
                    </Stack>
                </div>
            </Stack>
        </Modal>
    );
};

export default styled<
    ICardboardModalProps,
    ICardboardModalStyleProps,
    ICardboardModalStyles
>(CardboardModal, getStyles);
