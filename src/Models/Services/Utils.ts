import React from 'react';

export const createGUID = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const getFileType = (fileName: string, defaultType = '') => {
    const fileSegments = fileName.split('.');
    return fileSegments.length > 1
        ? fileSegments[fileSegments.length - 1]
        : defaultType;
};

export const createNodeFilterFromRoot = (parentNodeModelName: string) => {
    return (nodes: any) => {
        const filteredNodes = {};
        Object.keys(nodes).forEach((nodeKey) => {
            const modelContents = nodes[nodeKey].nodeData?.model?.contents;
            const filteredContents = modelContents.filter((content) => {
                return (
                    content['@type'] === 'Relationship' &&
                    content.name === 'inBIM' && // inBIM currently hardcoded - a sort of reserved relationship for twin creation from a BIM file
                    content.target === parentNodeModelName
                );
            });
            if (filteredContents.length === 1) {
                filteredNodes[nodeKey] = nodes[nodeKey];
            }
        });

        return filteredNodes;
    };
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
