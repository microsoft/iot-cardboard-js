// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* This code is used for local development purposes only.
Library consumers are responsible for creating server side middleware
as necessary and appropriate for their scenarios. */

const { createProxyMiddleware } = require('http-proxy-middleware');
const retryNumber = 3;

module.exports = function (app) {
    const validAdtHostSuffixes = ['.digitaltwins.azure.net'];
    const isValidAdtHostUrl = (urlPrefix) =>
        /^[a-zA-z0-9]{1}[a-zA-Z0-9-]{1,60}[a-zA-Z0-9]{1}(\.api)\.[a-zA-Z0-9]{1,}$/.test(
            urlPrefix
        );
    const validBlobHostSuffixes = ['.blob.core.windows.net'];
    const isValidBlobHostUrl = (urlPrefix) =>
        /^[a-z0-9]{3,24}$/.test(urlPrefix);

    const validHeaders = [
        'Accept',
        'Accept-Encoding',
        'Accept-Language',
        'authorization',
        'Content-Length',
        'content-type',
        'Host',
        'x-ms-client-request-id',
        'x-ms-useragent',
        'User-Agent',
        'x-ms-version',
        'x-ms-blob-type',
        'x-ms-copy-source',
        'x-ms-requires-sync'
    ];

    // eslint-disable-next-line max-len
    const proxyResponseHeaders = {
        'Content-Security-Policy':
            "default-src 'self' data: 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'none'"
    };

    const removeUnnecessaryRequestHeaders = (proxyReq) => {
        // remove all unnecessary headers
        let newHeaderMap = {};
        validProxyRequestHeaders.forEach((header) => {
            let headerValue = proxyReq.getHeader(header);
            if (headerValue !== undefined) {
                newHeaderMap[header] = headerValue;
            }
        });
        Object.keys(proxyReq.getHeaders()).forEach((header) => {
            proxyReq.removeHeader(header);
        });
        Object.keys(newHeaderMap).forEach((header) => {
            proxyReq.setHeader(header, newHeaderMap[header]);
        });
        return proxyReq;
    };

    const setResponseHeaders = (proxyRes) => {
        Object.keys(proxyResponseHeaders).forEach((header) => {
            proxyRes.headers[header] = proxyResponseHeaders[header];
        });
        return proxyRes;
    };

    const validateAdtUrlFromHeader = (req) => {
        // validate ADT environment URL
        let xAdtHostHeader = req.headers['x-adt-host'].toLowerCase();
        let adtUrl = `https://${xAdtHostHeader}/`;
        let adtUrlObject = new URL(adtUrl);
        if (
            validAdtHostSuffixes.some(
                (suffix) =>
                    adtUrlObject.host.endsWith(suffix) &&
                    isValidAdtHostUrl(
                        adtUrlObject.host.substring(
                            0,
                            adtUrlObject.host.length - suffix.length
                        )
                    )
            )
        ) {
            return adtUrl;
        } else {
            throw 'Invalid ADT Environment URL';
        }
    };

    const createAdtProxyMiddlewareObject = (route) => {
        return createProxyMiddleware({
            changeOrigin: true,
            headers: {
                connection: 'keep-alive'
            },
            secure: true,
            target: '/',
            onProxyReq: removeUnnecessaryRequestHeaders,
            onProxyRes: setResponseHeaders,
            pathRewrite: {
                [route]: ''
            },
            router: validateAdtUrlFromHeader
        });
    };

    app.use('/proxy/adt', createAdtProxyMiddlewareObject('/proxy/adt'));

    const blobProxy = createProxyMiddleware({
        changeOrigin: true,
        headers: {
            connection: 'keep-alive'
        },
        secure: true,
        target: '/',
        onProxyReq: removeUnnecessaryRequestHeaders,
        onProxyRes: setResponseHeaders,
        pathRewrite: {
            '/proxy/blob': ''
        },
        router: (req) => {
            const blobHost = req.headers['x-blob-host'];
            const blobHostUrl = `https://${blobHost}/`;
            const blobHostUrlObject = new URL(blobHostUrl);
            if (
                validBlobHostSuffixes.some(
                    (suffix) =>
                        blobHostUrlObject.host.endsWith(suffix) &&
                        isValidBlobHostUrl(
                            blobHostUrlObject.host.substring(
                                0,
                                blobHostUrlObject.host.length - suffix.length
                            )
                        )
                )
            ) {
                return blobHostUrl;
            }
            throw 'Invalid Blob URL';
        },
        onError: (err, req, res) => {
            const code = err.code;
            if (code == 'ECONNRESET') {
                if (
                    !req.currentRetryAttempt ||
                    req.currentRetryAttempt <= retryNumber
                ) {
                    req.currentRetryAttempt = req.currentRetryAttempt
                        ? req.currentRetryAttempt++
                        : 1;
                    console.log(
                        'Proxy server retry request attempt number: ' +
                            req.currentRetryAttempt
                    );
                    blobProxy.call(blobProxy, req, res); // resend the original request to proxy middleware again
                } else {
                    console.log(
                        'All proxy server retry attempts failed, returning error...'
                    );
                    res.status(504);
                }
            } else {
                switch (code) {
                    case 'ENOTFOUND':
                    case 'ECONNREFUSED':
                        res.status(504);
                        break;
                    default:
                        res.status(500);
                }
            }
        }
    });

    app.use('/proxy/blob', (req, res, next) =>
        blobProxy.call(blobProxy, req, res, next)
    );
};
