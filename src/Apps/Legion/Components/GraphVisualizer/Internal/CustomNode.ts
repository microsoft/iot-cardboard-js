import { ICustomNodeConfig } from '../GraphTypes.types';

const ERROR_COLOR = '#F5222D';
const getNodeConfig = (node) => {
    if (node.nodeError) {
        return {
            basicColor: ERROR_COLOR,
            fontColor: '#FFF',
            borderColor: ERROR_COLOR,
            bgColor: '#E66A6C'
        };
    }
    let config = {
        basicColor: '#5B8FF9',
        fontColor: '#5B8FF9',
        borderColor: '#5B8FF9',
        bgColor: '#C6E5FF'
    };
    switch (node.type) {
        case 'root': {
            config = {
                basicColor: '#E3E6E8',
                fontColor: 'rgba(0,0,0,0.85)',
                borderColor: '#E3E6E8',
                bgColor: '#5b8ff9'
            };
            break;
        }
        default:
            break;
    }
    return config;
};

const nodeBasicMethod = {
    createNodeBox: (group, config, width: number, height: number) => {
        /* container */
        const container = group.addShape('rect', {
            attrs: {
                x: 0,
                y: 0,
                width,
                height
            }
        });
        /* box */
        group.addShape('rect', {
            attrs: {
                x: 3,
                y: 0,
                width: width - 19,
                height,
                fill: config.bgColor,
                stroke: config.borderColor,
                radius: 2,
                cursor: 'pointer'
            }
        });

        /* left border */
        group.addShape('rect', {
            attrs: {
                x: 3,
                y: 0,
                width: 3,
                height,
                fill: config.basicColor,
                radius: 1.5
            }
        });
        return container;
    },
    /* 生成树上的 marker */
    createNodeMarker: (group, collapsed, x, y) => {
        group.addShape('circle', {
            attrs: {
                x,
                y,
                r: 13,
                fill: 'rgba(47, 84, 235, 0.05)',
                opacity: 0,
                zIndex: -2
            },
            className: 'collapse-icon-bg'
        });
        group.addShape('marker', {
            attrs: {
                x,
                y,
                radius: 7,
                // symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
                stroke: 'rgba(0,0,0,0.25)',
                fill: 'rgba(0,0,0,0)',
                lineWidth: 1,
                cursor: 'pointer'
            },
            className: 'collapse-icon'
        });
    },
    afterDraw: (cfg, group) => {
        /* ip 显示 */
        const ipBox = group.findByClassName('ip-box');
        if (ipBox) {
            /* ip 复制的几个元素 */
            const ipLine = group.findByClassName('ip-cp-line');
            const ipBG = group.findByClassName('ip-cp-bg');
            const ipIcon = group.findByClassName('ip-cp-icon');
            const ipCPBox = group.findByClassName('ip-cp-box');

            const onMouseEnter = () => {
                ipLine.attr('opacity', 1);
                ipBG.attr('opacity', 1);
                ipIcon.attr('opacity', 1);
                // graph.get('canvas').draw();
            };
            const onMouseLeave = () => {
                ipLine.attr('opacity', 0);
                ipBG.attr('opacity', 0);
                ipIcon.attr('opacity', 0);
                // graph.get('canvas').draw();
            };
            ipBox.on('mouseenter', () => {
                onMouseEnter();
            });
            ipBox.on('mouseleave', () => {
                onMouseLeave();
            });
            ipCPBox.on('mouseenter', () => {
                onMouseEnter();
            });
            ipCPBox.on('mouseleave', () => {
                onMouseLeave();
            });
            ipCPBox.on('click', () => {
                alert('clicked ip');
            });
        }
    },
    setState: (name, value, item) => {
        const hasOpacityClass = [
            'ip-cp-line',
            'ip-cp-bg',
            'ip-cp-icon',
            'ip-cp-box',
            'ip-box',
            'collapse-icon-bg'
        ];
        const group = item.getContainer();
        const childrens = group.get('children');
        // graph.setAutoPaint(false);
        if (name === 'emptiness') {
            if (value) {
                childrens.forEach((shape) => {
                    if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
                        return;
                    }
                    shape.attr('opacity', 0.4);
                });
            } else {
                childrens.forEach((shape) => {
                    if (hasOpacityClass.indexOf(shape.get('className')) > -1) {
                        return;
                    }
                    shape.attr('opacity', 1);
                });
            }
        }
        // graph.setAutoPaint(true);
    }
};

export const CustomNode = {
    drawShape: (cfg: ICustomNodeConfig, group) => {
        const config = getNodeConfig(cfg);
        /* 最外面的大矩形 */
        const container = nodeBasicMethod.createNodeBox(group, config, 243, 64);

        /* name */
        group.addShape('text', {
            attrs: {
                text: cfg.data.name.substring(0, 10),
                x: 3,
                y: 10,
                fontSize: 14,
                fontWeight: 700,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: config.fontColor,
                cursor: 'pointer'
            },
            tooltip: cfg.data.name
        });

        /* id */
        group.addShape('text', {
            attrs: {
                text: cfg.data.id.substring(0, 10),
                x: 3,
                y: 26,
                fontSize: 12,
                textAlign: 'left',
                textBaseline: 'middle',
                fill: 'rgba(0,0,0,0.65)'
            },
            tooltip: cfg.data.id
        });

        const hasChildren = cfg.children && cfg.children.length > 0;
        if (hasChildren) {
            nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 236, 32);
        }
        return container;
    },
    afterDraw: nodeBasicMethod.afterDraw,
    setState: nodeBasicMethod.setState
};
