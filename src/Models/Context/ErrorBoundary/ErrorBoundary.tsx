import React, {
    ComponentType,
    Dispatch,
    ErrorInfo,
    useContext,
    useMemo,
    useState
} from 'react';
import './ErrorBoundary.scss';

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
// this hook exposes the error and errorInfo from the error boundary context, use this in components to display the error message (e.g. in cards)
export const useErrorBoundaryContext = (): [
    Error,
    ErrorInfo,
    Dispatch<boolean>
] => {
    const context = useContext(ErrorBoundaryContext);
    return [context.error, context.errorInfo, context.setIsHandled];
};

const ErrorBoundaryWrapper: React.FC = React.memo(({ children }) => {
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
    const childrenComponent = useMemo(() => children, []);
    return (
        <ErrorBoundaryContext.Provider value={errorContextValue}>
            <ErrorBoundary
                onError={(error, errorInfo) => {
                    setError(error);
                    setErrorInfo(errorInfo);
                }}
                isHandled={isHandled}
            >
                {childrenComponent}
            </ErrorBoundary>
        </ErrorBoundaryContext.Provider>
    );
});

// apply this method to a component to wrap it within ErrorBoundary class component which keeps track of errors
export function withErrorBoundary<Props = Record<string, unknown>>(
    Component: ComponentType<Props>
): React.FC<Props> {
    debugger;
    return (props: Props) => (
        <ErrorBoundaryWrapper>
            <Component {...props} />
        </ErrorBoundaryWrapper>
    );
}

interface ErrorBoundaryProps {
    onError: (error: Error, errorInfo: ErrorInfo) => void;
    isHandled: boolean;
}

interface ErrorBoundaryState {
    error: Error;
    hasError: boolean;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props) {
        super(props);
        this.state = { error: null, hasError: false };
    }

    // invoked after an error has been thrown by a descendant component, updating state to render fallback UI
    static getDerivedStateFromError(error) {
        return {
            error: error,
            hasError: true
        };
    }

    // call the callback function as side effect to populate error through context when an error is thrown
    componentDidCatch(error, errorInfo) {
        this.props.onError(error, errorInfo);
    }

    render() {
        // if (!this.props.isHandled && this.state.hasError) {
        //     // this fallback UI is still needed to show the errors which even prevents base cards in card components to be rendered
        //     // return (
        //     //     <div className="cb-error-boundary">
        //     //         <h2>Something went wrong.</h2>
        //     //         <details className="cb-error-boundary-details">
        //     //             {this.state.error &&
        //     //                 this.state.error.name +
        //     //                     ': ' +
        //     //                     this.state.error.message}
        //     //             <br />
        //     //             {this.state.error.stack}
        //     //         </details>
        //     //     </div>
        //     // );
        //     // return (
        //     //     <BaseCard
        //     //         isLoading={false}
        //     //         adapterResult={null}
        //     //         cardError={
        //     //             new CardError({
        //     //                 isCatastrophic: true,
        //     //                 type: CardErrorType.ErrorBoundary,
        //     //                 name: this.state.error.name,
        //     //                 message: this.state.error.message,
        //     //                 rawError: new Error(this.state.error.stack)
        //     //             })
        //     //         }
        //     //     />
        //     // );
        // }
        return this.props.children;
    }
}
