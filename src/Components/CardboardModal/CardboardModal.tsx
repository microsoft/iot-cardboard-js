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
        isOpen,
        onDismiss,
        primaryButtonProps,
        title,
        children,
        destructiveButtonProps,
        styles,
        subTitle,
        titleIconName
    } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();
    const titleId = useId('modal-title');

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Modal
            isOpen={isOpen}
            titleAriaId={titleId}
            onDismiss={onDismiss}
            styles={classNames.subComponentStyles.modal}
        >
            <Stack tokens={stackTokens} style={{ height: '100%' }}>
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
                    {destructiveButtonProps && (
                        <PrimaryButton {...destructiveButtonProps} />
                    )}
                    <Stack
                        tokens={stackTokens}
                        horizontal={true}
                        horizontalAlign={'end'}
                    >
                        <PrimaryButton {...primaryButtonProps} />
                        <DefaultButton text={t('cancel')} onClick={onDismiss} />
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
