// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const { createProxyMiddleware } = require('http-proxy-middleware');
const retryNumber = 3;

module.exports = function (app) {
    const validAdtHostSuffixes = ['.digitaltwins.azure.net'];
    const validBlobHostSuffixes = ['.blob.core.windows.net'];

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

    app.use(
        '/proxy/adt',
        createProxyMiddleware({
            changeOrigin: true,
            headers: {
                connection: 'keep-alive'
            },
            secure: true,
            target: '/',
            onProxyReq: (proxyReq) => {
                // Remove all unnecessary headers
                const newHeaderMap = {};
                validHeaders.forEach((header) => {
                    const headerValue = proxyReq.getHeader(header);
                    // eslint-disable-next-line no-undefined
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
            },
            onProxyRes: (proxyRes) => {
                Object.keys(proxyResponseHeaders).forEach((header) => {
                    proxyRes.headers[header] = proxyResponseHeaders[header];
                });
            },
            pathRewrite: {
                '/proxy/adt': ''
            },
            router: (req) => {
                // Validate ADT environment URL
                const xAdtHostHeader = req.headers['x-adt-host'].toLowerCase();
                const adtUrl = `https://${xAdtHostHeader}/`;
                const adtUrlObject = new URL(adtUrl);
                if (
                    validAdtHostSuffixes.some((suffix) =>
                        adtUrlObject.host.endsWith(suffix)
                    )
                ) {
                    return adtUrl;
                }
                throw new Error('Invalid ADT Environment URL');
            }
        })
    );

    const blobProxy = createProxyMiddleware({
        changeOrigin: true,
        headers: {
            connection: 'keep-alive'
        },
        secure: true,
        target: '/',
        onProxyReq: (proxyReq) => {
            // Remove all unnecessary headers
            const newHeaderMap = {};
            validHeaders.forEach((header) => {
                const headerValue = proxyReq.getHeader(header);
                // eslint-disable-next-line no-undefined
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
        },
        onProxyRes: (proxyRes) => {
            Object.keys(proxyResponseHeaders).forEach((header) => {
                proxyRes.headers[header] = proxyResponseHeaders[header];
            });
        },
        pathRewrite: {
            '/proxy/blob': ''
        },
        router: (req) => {
            const blobHost = req.headers['x-blob-host'];
            const blobHostUrl = `https://${blobHost}/`;
            const blobHostUrlObject = new URL(blobHostUrl);
            if (
                validBlobHostSuffixes.some((suffix) =>
                    blobHostUrlObject.host.endsWith(suffix)
                )
            ) {
                return blobHostUrl;
            }
            throw new Error('Invalid Blob URL');
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
                    res.send(err.message);
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
                res.send(err.message);
            }
        }
    });

    app.use('/proxy/blob', (req, res, next) =>
        blobProxy.call(blobProxy, req, res, next)
    );
};
