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

export const getParams = (url) => {
    const params = {};
    if (url) {
        const parts = url.split('?')[1].split('&');
        for (let i = 0; i < parts.length; i++) {
            const nv = parts[i].split('=');
            if (!nv[0]) {
                continue;
            }
            params[nv[0]] = nv[1] || true;
        }
    }
    return params;
};

export const getUrlParam = (url, key) => {
    const params = getParams(url);
    return key in params ? params[key] : null;
};
