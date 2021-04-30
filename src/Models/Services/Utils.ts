import axios from 'axios';
import React from 'react';
import AdapterMethodSandbox from '../Classes/AdapterMethodSandbox';
import AdapterResult from '../Classes/AdapterResult';
import { AdapterErrorType } from '../Constants/Enums';
import {
    IAdapterData,
    IAuthService,
    ICancellablePromise
} from '../Constants/Interfaces';
import { AxiosParams } from '../Constants/Types';

export const createGUID = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const createSeededGUID = (seededRandomNumGen: () => number) => {
    const s4 = () => {
        return Math.floor((1 + seededRandomNumGen()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const getMarkedHtmlBySearch = (str, searchTerm) => {
    try {
        const regexp = new RegExp(searchTerm, 'gi');
        const matches = str.match(regexp);
        return str
            .split(regexp)
            .map((s, i) =>
                React.createElement('span', { key: i }, [
                    s,
                    i < matches?.length
                        ? React.createElement(
                              'mark',
                              { key: `marked_${i}` },
                              matches[i]
                          )
                        : null
                ])
            );
    } catch (e) {
        return str;
    }
};

export function cancellableAxiosPromise(
    authService: IAuthService,
    returnDataClass: { new (data: any) },
    axiosParams: AxiosParams
): ICancellablePromise<AdapterResult<any>> {
    const adapterMethodSandbox = new AdapterMethodSandbox({
        authservice: authService
    });

    const { url, method, headers, params, data } = axiosParams;
    const cancelTokenSource = axios.CancelToken.source();

    const cancellablePromise = adapterMethodSandbox.safelyFetchData(
        async (token) => {
            let axiosData;
            try {
                axiosData = await axios({
                    method: method,
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: 'Bearer ' + token,
                        ...headers
                    },
                    params: params,
                    data: data,
                    cancelToken: cancelTokenSource.token
                });
            } catch (err) {
                if (axios.isCancel(err)) {
                    adapterMethodSandbox.pushError({
                        type: AdapterErrorType.DataFetchFailed,
                        isCatastrophic: false,
                        rawError: err
                    });
                } else {
                    adapterMethodSandbox.pushError({
                        type: AdapterErrorType.DataFetchFailed,
                        isCatastrophic: true,
                        rawError: err
                    });
                }
            }
            const result = axiosData?.data;
            return new returnDataClass(result);
        }
    ) as ICancellablePromise<AdapterResult<any>>;
    cancellablePromise.cancel = cancelTokenSource.cancel;
    return cancellablePromise;
}
