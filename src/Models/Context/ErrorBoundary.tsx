import React, {
    ComponentType,
    Dispatch,
    ErrorInfo,
    useContext,
    useMemo,
    useState
} from 'react';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';
import { ComponentError } from '../Classes/Errors';
import { ComponentErrorType, Theme } from '../Constants/Enums';

interface IErrorBoundaryContext {
    error: Error;
    errorInfo: ErrorInfo;
    setIsHandled: Dispatch<boolean>;
}

const ErrorBoundaryContext = React.createContext<IErrorBoundaryContext>({
    error: null,
    errorInfo: null,
    setIsHandled: (_isHandled: boolean) => undefined
});

/** This hook exposes the error and errorInfo from the error boundary context
 * can be used to handle the error within children components, but make sure the buggy component
 * is going to be unmounted and when re-render handle error nicely: https://github.com/facebook/react/issues/12865
 *  */
export const useErrorBoundaryContext = (): [
    Error,
    ErrorInfo,
    Dispatch<boolean>
] => {
    const context = useContext(ErrorBoundaryContext);
    return [context.error, context.errorInfo, context.setIsHandled];
};

const ErrorBoundaryWrapper: React.FC<{
    theme?: Theme;
    title?: string;
    onErrorBoundary?: (error, errorInfo) => any;
}> = ({ theme, title, onErrorBoundary, children }) => {
    const [error, setError] = useState(null);
    const [errorInfo, setErrorInfo] = useState(null);
    const [isHandled, setIsHandled] = useState(false);
    const errorContextValue = useMemo(
        () => ({
            error,
            errorInfo,
            setIsHandled
        }),
        [error, errorInfo]
    );
    return (
        <ErrorBoundaryContext.Provider value={errorContextValue}>
            <ErrorBoundary
                onError={(error, errorInfo) => {
                    setError(error);
                    setErrorInfo(errorInfo);
                    if (typeof onErrorBoundary === 'function') {
                        onErrorBoundary(error, errorInfo);
                    }
                }}
                isHandled={isHandled}
                theme={theme}
                cardTitle={title}
            >
                {children}
            </ErrorBoundary>
        </ErrorBoundaryContext.Provider>
    );
};

// Apply this method to a component to wrap it within ErrorBoundary class component which keeps track of errors
export function withErrorBoundary<T>(Component: ComponentType<T>) {
    return React.forwardRef<
        unknown,
        T & {
            theme?: Theme;
            title?: string;
            onErrorBoundary?: (error, errorInfo) => any;
        }
    >((props, ref) => {
        return (
            <ErrorBoundaryWrapper
                theme={props.theme}
                title={props.title}
                onErrorBoundary={props.onErrorBoundary}
            >
                <Component {...props} ref={ref ?? undefined} />
            </ErrorBoundaryWrapper>
        );
    });
}
interface ErrorBoundaryProps {
    onError: (error: Error, errorInfo: ErrorInfo) => void;
    isHandled?: boolean;
    theme: Theme;
    cardTitle?: string;
}

interface ErrorBoundaryState {
    error: Error;
    hasError: boolean;
}

/** Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.
 * Error boundaries do not catch errors inside event handlers, use try/catch block for those: https://reactjs.org/docs/error-boundaries.html */
class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props) {
        super(props);
        this.state = { error: null, hasError: false };
    }

    // Invoked after an error has been thrown by a descendant component, updating state to render fallback UI
    static getDerivedStateFromError(error) {
        return {
            error: error,
            hasError: true
        };
    }

    // Call the callback function as side effect to expose error via context when an error is thrown
    componentDidCatch(error, errorInfo) {
        this.props.onError(error, errorInfo);
    }

    render() {
        if (!this.props.isHandled && this.state.hasError) {
            return (
                <BaseComponent
                    theme={this.props.theme}
                    componentError={
                        new ComponentError({
                            isCatastrophic: true,
                            type: ComponentErrorType.ErrorBoundary,
                            name: this.state.error.name,
                            message: this.state.error.message,
                            rawError: new Error(this.state.error.stack)
                        })
                    }
                ></BaseComponent>
            );
        }
        return this.props.children;
    }
}
