import React from 'react';
import { TutorialModalPage } from '../TutorialModal.types';
import ConceptsRootSvg from '../../../Resources/Static/concepts.svg';
import IllustrationPage from './IllustrationPage';

const ConceptPage: React.FC<{ pageKey: string }> = ({ pageKey }) => {
    if (pageKey === TutorialModalPage.CONCEPTS) {
        return (
            <IllustrationPage
                svgSrc={ConceptsRootSvg}
                title="Need a deeper dive on the concepts?"
                text="Browse the help content or check out our documentation for step by step tutorials!"
            />
        );
    } else {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}
            >
                {pageKey}
            </div>
        );
    }
};

export default ConceptPage;
