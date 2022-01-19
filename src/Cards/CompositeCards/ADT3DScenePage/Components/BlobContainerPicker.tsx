import React, { useEffect } from 'react';
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
    onContainerUrlSelect: (
        selectedBlobContainerPath: string,
        blobContainerPaths: Array<string>
    ) => void;
}> = ({ selectedContainerUrl, onContainerUrlSelect, existingOptions }) => {
    const { t } = useTranslation();
    const [options, setOptions] = React.useState<Array<IComboBoxOption>>([]);
    const [selectedKey, setSelectedKey] = React.useState<
        string | number | undefined
    >('');

    useEffect(() => {
        setOptions(
            (existingOptions ?? []).map((o) => ({
                key: `${o}`,
                text: o
            }))
        );
        if (selectedContainerUrl) {
            setSelectedKey(selectedContainerUrl);
        }
    }, [existingOptions, selectedContainerUrl]);

    const onChange = React.useCallback(
        (
            _event: React.FormEvent<IComboBox>,
            option?: IComboBoxOption,
            _index?: number,
            value?: string
        ): void => {
            if (!option && value) {
                setOptions((prevOptions) => [
                    ...prevOptions,
                    { key: value, text: value }
                ]);
                onContainerUrlSelect(
                    value,
                    options.map((o) => o.text).concat([value])
                );
            } else {
                onContainerUrlSelect(
                    option.text,
                    options.map((o) => o.text)
                );
            }

            setSelectedKey(value);
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
