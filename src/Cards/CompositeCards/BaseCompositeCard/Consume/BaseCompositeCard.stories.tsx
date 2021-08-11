import React, { Component, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseCompositeCard from './BaseCompositeCard';
import {
    useErrorBoundaryContext,
    withErrorBoundary
} from '../../../../Models/Context/ErrorBoundary';
import BaseCard from '../../../Base/Consume/BaseCard';

export default {
    title: 'CompositeCards/BaseCompositeCard/Consume'
};

export const EmptyCompositeCard = (_args, { globals: { theme, locale } }) => {
    const { t } = useTranslation();

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCompositeCard
                title={t('emptyCompositeCard')}
                theme={theme}
                locale={locale}
            />
        </div>
    );
};

const BaseCardWithErrorBoundary = withErrorBoundary(BaseCard);
export const ErrorBoundaryCompositeCard = (
    _args,
    { globals: { theme, locale } }
) => {
    const { t } = useTranslation();
    class BuggyCounter extends Component<any, any> {
        constructor(props) {
            super(props);
            this.state = { counter: 0 };
            this.handleClick = this.handleClick.bind(this);
        }

        handleClick() {
            this.setState(({ counter }) => ({
                counter: counter + 1
            }));
        }

        render() {
            if (this.state.counter === 5) {
                // Simulate a JS error
                throw new Error('I crashed!');
            }
            return <h1 onClick={this.handleClick}>{this.state.counter}</h1>;
        }
    }

    const BuggyCounterWithErrorHandling: React.FC<
        Record<string, unknown>
    > = () => {
        const [counter, setCounter] = useState(0);
        const [error, errorInfo, setErrorIsHandled] = useErrorBoundaryContext(); // catch the error thrown from error boundary context
        useEffect(() => {
            /** inform the context about handling the error itself, make sure not to attempt to render the same buggy part while handling the error within itself
             * and keep in mind that the component which throws the error is going to be unmounted, so this approach is not reliable for components which makes api requests onmount
             */
            setErrorIsHandled(true);
        }, [error, errorInfo]);

        useEffect(() => {
            if (counter === 5) {
                // Simulate a JS error
                throw new Error('I crashed!');
            }
        }, [counter]);

        return (
            <>
                {error ? (
                    <div
                        style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        Error handled by component: {error.toString()}
                        <details
                            style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
                        >
                            <br />
                            {errorInfo.componentStack}
                        </details>
                    </div>
                ) : (
                    <h1 onClick={() => setCounter(counter + 1)}>{counter}</h1>
                )}
            </>
        );
    };

    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCompositeCard
                title={t('compositeCardWithErrors')}
                theme={theme}
                locale={locale}
            >
                <BaseCardWithErrorBoundary
                    title="BaseCard-1 component with buggy content"
                    theme={theme}
                    locale={locale}
                    isLoading={false}
                    adapterResult={null}
                >
                    <BuggyCounter />
                </BaseCardWithErrorBoundary>

                <BaseCardWithErrorBoundary
                    title="BaseCard-2 component with buggy content"
                    theme={theme}
                    locale={locale}
                    isLoading={false}
                    adapterResult={null}
                >
                    <BuggyCounter />
                </BaseCardWithErrorBoundary>

                <BaseCardWithErrorBoundary
                    title="BaseCard-3 error handling component with buggy content"
                    theme={theme}
                    locale={locale}
                    isLoading={false}
                    adapterResult={null}
                >
                    <BuggyCounterWithErrorHandling />
                </BaseCardWithErrorBoundary>
            </BaseCompositeCard>
        </div>
    );
};
