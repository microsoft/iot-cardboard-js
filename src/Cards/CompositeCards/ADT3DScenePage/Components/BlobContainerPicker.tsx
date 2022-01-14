import React, { useEffect, useRef } from 'react';
import {
    ComboBox,
    IComboBox,
    IComboBoxOption,
    IComboBoxStyles
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const comboBoxStyles: Partial<IComboBoxStyles> = {
    root: { maxWidth: 480 },
    optionsContainerWrapper: { minWidth: 480 }
};

export const ADTSceneConfigBlobContainerPicker: React.FunctionComponent<{
    existingOptions?: Array<string>;
    selectedContainerUrl?: string;
    onSelect: (selectedBlobPath: string, paths: Array<string>) => void;
}> = ({ selectedContainerUrl, onSelect, existingOptions }) => {
    const { t } = useTranslation();
    const newKey = useRef(1);
    const [options, setOptions] = React.useState<Array<IComboBoxOption>>(
        (existingOptions ?? []).map((o) => ({
            key: `${newKey.current++}`,
            text: o
        }))
    );
    const [selectedKey, setSelectedKey] = React.useState<
        string | number | undefined
    >(
        selectedContainerUrl
            ? options.findIndex((o) => o.text === selectedContainerUrl)
            : ''
    );

    useEffect(() => {
        if (existingOptions.length > 0) {
            newKey.current = 1;
            setOptions(
                (existingOptions ?? []).map((o) => ({
                    key: `${newKey.current++}`,
                    text: o
                }))
            );
        }
    }, [existingOptions]);

    useEffect(() => {
        if (selectedContainerUrl) {
            const isSelectedIncluded = options.findIndex(
                (o) => o.text === selectedContainerUrl
            );
            if (isSelectedIncluded === -1) {
                const key = `${newKey.current++}`;
                setOptions((prevOptions) => [
                    ...prevOptions,
                    { key: `${key}`, text: selectedContainerUrl }
                ]);
                setSelectedKey(key);
            } else {
                setSelectedKey(
                    options.find((o) => o.text === selectedContainerUrl).key
                );
            }
        }
    }, [selectedContainerUrl]);

    const onChange = React.useCallback(
        (
            _event: React.FormEvent<IComboBox>,
            option?: IComboBoxOption,
            _index?: number,
            value?: string
        ): void => {
            let key = option?.key as string;
            if (!option && value) {
                key = `${newKey.current++}`;
                setOptions((prevOptions) => [
                    ...prevOptions,
                    { key: key, text: value }
                ]);
                onSelect(value, options.map((o) => o.text).concat([value]));
            } else {
                onSelect(
                    option.text,
                    options.map((o) => o.text)
                );
            }

            setSelectedKey(key);
        },
        [options]
    );

    return (
        <ComboBox
            selectedKey={selectedKey}
            autoComplete="on"
            allowFreeform={true}
            options={options}
            onChange={onChange}
            styles={comboBoxStyles}
            placeholder={t('3dScenePage.enterBlobUrl')}
        />
    );
};
