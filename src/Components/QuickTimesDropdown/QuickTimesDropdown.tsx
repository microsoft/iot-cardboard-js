import React from 'react';
import {
    IQuickTimesDropdownProps,
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles
} from './QuickTimesDropdown.types';
import { getStyles } from './QuickTimesDropdown.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Dropdown
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getQuickTimeSpanOptions } from '../../Models/SharedUtils/DataHistoryUtils';

const getClassNames = classNamesFunction<
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles
>();

const QuickTimesDropdown: React.FC<IQuickTimesDropdownProps> = (props) => {
    const {
        defaultSelectedKey,
        hasLabel = true,
        label,
        onRenderLabel,
        onRenderTitle,
        onRenderCaretDown,
        onChange,
        styles
    } = props;

    // hooks
    const { t } = useTranslation();

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    return (
        <Dropdown
            placeholder={t('quickTimesDropdown.placeholder')}
            className={classNames.root}
            label={
                hasLabel ? label || t('quickTimesDropdown.label') : undefined
            }
            defaultSelectedKey={defaultSelectedKey}
            onChange={onChange}
            options={getQuickTimeSpanOptions(t)}
            onRenderLabel={onRenderLabel}
            onRenderTitle={onRenderTitle}
            onRenderCaretDown={onRenderCaretDown}
            dropdownWidth={'auto'}
        />
    );
};

export default styled<
    IQuickTimesDropdownProps,
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles
>(QuickTimesDropdown, getStyles);
