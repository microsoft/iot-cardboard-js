const express = require('express'),
    { createProxyMiddleware } = require('http-proxy-middleware'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express();

app.use(cors());

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
const pathRewrite = async function (path, req) {
    return path.replace('/api/proxy/adt', '');
};

app.all(
    '/api/proxy/adt',
    createProxyMiddleware({
        changeOrigin: true,
        headers: {
            connection: 'keep-alive'
        },
        secure: true,
        target: '/',
        onProxyReq: (proxyReq) => {
            // remove all unnecessary headers
            let newHeaderMap = {};
            validHeaders.forEach((header) => {
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
        },
        pathRewrite,
        router: (req) => {
            // validate ADT environment URL
            let xAdtHostHeader = req.headers['x-adt-host'].toLowerCase();
            let xAdtEndpointHeader = req.headers['x-adt-endpoint'];
            let adtUrl = `https://${xAdtHostHeader}/${xAdtEndpointHeader}`;
            let adtUrlObject = new URL(adtUrl);
            if (
                validAdtHostSuffixes.some((suffix) =>
                    adtUrlObject.host.endsWith(suffix)
                )
            ) {
                return adtUrl;
            } else {
                throw 'Invalid ADT Environment URL';
            }
        }
    })
);

app.use(bodyParser.json());
app.set('port', process.env.PORT || 3002); // TODO: change port if necessary

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
