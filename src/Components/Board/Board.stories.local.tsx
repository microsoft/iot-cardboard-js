import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import Board from './Board';
import { BoardInfo } from '../../Models/Classes';
import { ADTAdapter } from '../../Adapters';
import {
    SampleBoardInfo,
    InvalidBoardInfo
} from '../../../.storybook/test_data/sampleBoardInfo';

const boardStyle = {
    height: '900px',
    width: '1280px'
};

export default {
    title: 'Components/Board',
    component: Board // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

export const AssetViewDemo = (_args, { globals: { theme, locale } }) => {
    const boardInfo = BoardInfo.fromObject(SampleBoardInfo);
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={boardStyle}>
            <Board
                theme={theme}
                locale={locale}
                boardInfo={boardInfo}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const ErrorHandling = (_args, { globals: { theme, locale } }) => {
    const boardInfo = BoardInfo.fromObject(InvalidBoardInfo);
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={boardStyle}>
            <Board
                theme={theme}
                locale={locale}
                boardInfo={boardInfo}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
