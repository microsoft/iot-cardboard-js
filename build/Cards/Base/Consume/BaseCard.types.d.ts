/// <reference types="react" />
export interface BaseCardProps {
    title?: string;
    isLoading: boolean;
    noData: boolean;
    children?: React.ReactNode;
}
