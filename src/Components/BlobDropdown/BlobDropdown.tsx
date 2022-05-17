import {
    ComboBox,
    IComboBoxOption,
    IComboBoxStyles,
    Icon,
    IOnRenderComboBoxLabelProps,
    Spinner,
    SpinnerSize,
    TooltipHost
} from '@fluentui/react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAdapter from '../../Models/Hooks/useAdapter';
import BaseComponent from '../BaseComponent/BaseComponent';
import { BlobDropdownProps } from './BlobDropdown.types';
import './BlobDropdown.scss';
import { IStorageBlob } from '../../Models/Constants/Interfaces';
import { SupportedBlobFileTypes } from '../../Models/Constants/Enums';
import prettyBytes from 'pretty-bytes';
import { ValidContainerHostSuffixes } from '../../Models/Constants/Constants';

const BlobDropdown: React.FC<BlobDropdownProps> = ({
    theme,
    locale,
    localeStrings,
    adapter,
    width = 360,
    hasLabel = true,
    label,
    placeholder,
    fileTypes = Object.values(SupportedBlobFileTypes),
    isRequired = false,
    onChange,
    onLoad,
    selectedBlobUrl
}) => {
    const { t } = useTranslation();
    const [files, setFiles] = useState<Array<IStorageBlob>>([]);
    const [customUrls, setCustomUrls] = useState<Array<string>>([]); // no local storage support yet
    const [valueToEdit, setValueToEdit] = useState(selectedBlobUrl ?? '');
    const [inputOrOption, setInputOrOption] = useState<'input' | 'option'>(
        null
    ); // letting user either select a file from blob storage or enter a url (e.g. from another container or somewhere else) manually

    const containerBlobsAdapterData = useAdapter({
        adapterMethod: () => adapter.getContainerBlobs(fileTypes),
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: true
    });

    useEffect(() => {
        if (!containerBlobsAdapterData.adapterResult.hasNoData()) {
            const files: Array<IStorageBlob> =
                containerBlobsAdapterData.adapterResult.result?.data;
            setFiles(files);
            if (onLoad) {
                onLoad(files);
            }
            if (selectedBlobUrl) {
                const selectedFileInContainer = files.find(
                    (f) => f.Path === selectedBlobUrl
                );
                if (!selectedFileInContainer) {
                    setCustomUrls([selectedBlobUrl]);
                } else {
                    if (valueToEdit === selectedBlobUrl) {
                        setValueToEdit(selectedFileInContainer.Name);
                    }
                }
            }
        }
    }, [containerBlobsAdapterData.adapterResult.result]);

    const comboBoxStyles: Partial<IComboBoxStyles> = {
        container: { paddingBottom: 16, width: width },
        root: { width: '100%' },
        optionsContainerWrapper: { width: width },
        optionsContainer: {
            selectors: {
                span: { width: '100%' }
            }
        }
    };

    const options: Array<IComboBoxOption> = useMemo(
        () =>
            files
                .map(
                    (f: IStorageBlob) =>
                        ({
                            key: f.Path,
                            text: f.Name,
                            data: f
                        } as IComboBoxOption)
                )
                .concat(
                    customUrls.map(
                        (c: string) =>
                            ({
                                key: c,
                                text: c
                            } as IComboBoxOption)
                    )
                ),
        [files, customUrls]
    );

    const FileIcon = ({ file }) => {
        let iconName = 'CubeShape';

        // extend this as necessary, or use literal text to represent file types since there is no exact correspondance with icons to file types
        switch (file.Name.split('.')[1]) {
            case SupportedBlobFileTypes.GLTransmissionFormat:
                iconName = 'CubeShape';
                break;
            case SupportedBlobFileTypes.GLTransmissionFormatBinary:
                iconName = 'PageData';
                break;
            case SupportedBlobFileTypes.JavaScriptObjectNotation:
                iconName = 'Code';
                break;
        }
        return (
            <Icon
                iconName={iconName}
                aria-hidden="true"
                style={{ paddingRight: 8 }}
            />
        );
    };

    const onRenderLabel = (p: IOnRenderComboBoxLabelProps) => (
        <div
            className={`cb-blob-dropdown-label ${
                !hasLabel ? 'cb-blob-dropdown-label-position-absolute ' : ''
            }`}
        >
            {hasLabel && p.props.label && (
                <span className={'cb-blob-dropdown-label-text-wrapper'}>
                    <span
                        className={`cb-blob-dropdown-label-text ${
                            isRequired ? 'cb-required' : ''
                        }`}
                    >
                        {p.props.label}
                    </span>
                    <TooltipHost
                        content={t('blobDropdown.supportedFileTypes', {
                            fileTypes: fileTypes.join(', ')
                        })}
                        styles={{
                            root: {
                                display: 'inline-block',
                                cursor: 'pointer',
                                height: 16
                            }
                        }}
                    >
                        <Icon iconName={'Info'} aria-label={t('info')} />
                    </TooltipHost>
                </span>
            )}
            {containerBlobsAdapterData.isLoading && (
                <Spinner
                    size={SpinnerSize.xSmall}
                    label={t('blobDropdown.loading3DFiles')}
                    ariaLive="assertive"
                    labelPosition="right"
                />
            )}
        </div>
    );

    const onRenderOption = (option: IComboBoxOption) => {
        return (
            <div className={'cb-blob-dropdown-option'}>
                <div className={'cb-blob-dropdown-option-left-text-wrapper'}>
                    {option.data && <FileIcon file={option.data} />}
                    <span>{option.text}</span>
                </div>
                <div className={'cb-blob-dropdown-option-right-size'}>
                    {option.data && getFileSize(option.data)}
                </div>
            </div>
        );
    };

    const getFileSize = useCallback((file: IStorageBlob) => {
        try {
            return prettyBytes(file?.Properties?.['Content-Length']);
        } catch (error) {
            return 'null';
        }
    }, []);

    // this validation can be improved as necessary
    const isValidUrlStr = useCallback((urlStr: string) => {
        try {
            let urlStringToTest = urlStr;
            if (!urlStr?.startsWith('https://')) {
                urlStringToTest = 'https://' + urlStringToTest;
            }
            return (
                urlStr &&
                ValidContainerHostSuffixes.some((suffix) =>
                    new URL(urlStringToTest).hostname.endsWith(suffix)
                ) &&
                fileTypes.some((suffix) => urlStringToTest.endsWith(suffix))
            );
        } catch (error) {
            return false;
        }
    }, []);

    const handleChange = useCallback(
        (option, value) => {
            setInputOrOption(option ? 'option' : 'input');
            let newVal = value ?? option?.text;
            if (value && isValidUrlStr(newVal)) {
                if (!newVal.startsWith('https://')) {
                    newVal = 'https://' + newVal;
                }
                const existingFile = files.find((f) => f.Path === newVal);
                if (existingFile) {
                    setInputOrOption('option'); // convert entered input to existing option
                    newVal = existingFile.Name;
                } else if (customUrls.findIndex((e) => e === newVal) === -1) {
                    setCustomUrls(customUrls.concat(newVal));
                }

                if (onChange) {
                    onChange(newVal);
                }
            }
            setValueToEdit(newVal);
            if (option && onChange) {
                onChange(option.data?.Path ?? option.text);
            }
        },
        [customUrls, files]
    );

    const customUrlInputError = useMemo(
        () =>
            valueToEdit &&
            inputOrOption === 'input' &&
            !isValidUrlStr(valueToEdit)
                ? t('blobDropdown.invalidBlobUrlPath')
                : undefined,
        [valueToEdit]
    );

    return (
        <BaseComponent
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
            containerClassName={`cb-blob-dropdown ${
                !hasLabel ? 'cb-blob-dropdown-with-overflow' : ''
            }`}
        >
            <ComboBox
                placeholder={placeholder ?? t('blobDropdown.selectFileOrEnter')}
                label={
                    hasLabel
                        ? label ?? t('blobDropdown.3dFileFromContainer')
                        : undefined
                }
                autoComplete={'on'}
                allowFreeform={true}
                options={options}
                styles={comboBoxStyles}
                required
                text={valueToEdit}
                errorMessage={customUrlInputError}
                onRenderLabel={onRenderLabel}
                onRenderOption={onRenderOption}
                onChange={(_e, option, _idx, value) =>
                    handleChange(option, value)
                }
            />
        </BaseComponent>
    );
};

export default memo(BlobDropdown);
