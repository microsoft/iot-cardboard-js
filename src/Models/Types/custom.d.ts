declare module '*.svg' {
    const content: any;
    export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
}
