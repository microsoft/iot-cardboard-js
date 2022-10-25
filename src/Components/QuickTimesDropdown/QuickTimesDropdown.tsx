import React from 'react';
import {
    IQuickTimesDropdownProps,
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles,
    QuickTimeSpans
} from './QuickTimesDropdown.types';
import { getStyles } from './QuickTimesDropdown.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IDropdownOption,
    Dropdown
} from '@fluentui/react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

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
        calloutProps,
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
            calloutProps={calloutProps}
        />
    );
};

const getQuickTimeSpanOptions = (t: TFunction): Array<IDropdownOption> => {
    return Object.keys(QuickTimeSpans).map((timeSpan) => ({
        key: timeSpan,
        text: t(`quickTimesDropdown.options.${timeSpan}`),
        data: QuickTimeSpans[timeSpan]
    }));
};

export default styled<
    IQuickTimesDropdownProps,
    IQuickTimesDropdownStyleProps,
    IQuickTimesDropdownStyles
>(QuickTimesDropdown, getStyles);
