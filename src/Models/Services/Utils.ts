export const createGUID = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

// TODO refactor tsiclient to export this function outside of UXClient module.
// Accessing through UXClient bloats package size > 1MB and breaks jest testing
// with 'window.URL.createObjectURL is not a function' error
export const transformTsqResultsForVisualization = (
    tsqResults: Array<any>,
    options
): Array<any> => {
    const result = [];
    tsqResults.forEach((tsqr, i) => {
        const transformedAggregate = {};
        const aggregatesObject = {};
        transformedAggregate[options[i].alias] = { '': aggregatesObject };

        if (Object.prototype.hasOwnProperty.call(tsqr, '__tsiError__'))
            transformedAggregate[''] = {};
        else {
            tsqr.timestamps.forEach((ts, j) => {
                aggregatesObject[ts] = tsqr.properties.reduce((p, c) => {
                    p[c.name] = c['values'][j];
                    return p;
                }, {});
            });
        }
        result.push(transformedAggregate);
    });
    return result;
};
