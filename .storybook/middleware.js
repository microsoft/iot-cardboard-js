// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    const pathRewrite = function (path) {
        return path.replace('/api/proxy', '');
    };

    const validAdtHostSuffixes = ['digitaltwins.azure.net'];

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
        'User-Agent'
    ];

    // eslint-disable-next-line max-len
    const proxyResponseHeaders = {
        'Content-Security-Policy':
            "default-src 'self' data: 'unsafe-inline' 'unsafe-eval'; frame-ancestors 'none'"
    };

    app.use(
        '/api/proxy',
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
            pathRewrite,
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
};
