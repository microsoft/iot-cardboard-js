declare module '*.svg' {
    const content: any;
    export const ReactComponent: React.FC<React.SVGProps<SVGElement>>;
    export default content;
}

declare module '*.jpeg';
declare module '*.jpg';
declare module '*.png';
