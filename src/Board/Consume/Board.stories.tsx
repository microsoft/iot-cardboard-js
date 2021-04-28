import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import Board from './Board';
import { BoardInfo } from '../../Models/Classes/BoardInfo';
import { SearchSpan } from '../../Models/Classes';
import { TsiAdapter } from '../../Adapters';
import { ADTAdapter } from '../../Adapters';
import TestAsv from '../../../.storybook/test_data/sample_asv';
import SameronBoard from '../../../.storybook/test_data/sample_asv4';

const boardStyle = {
    height: '720px',
    width: '1280px'
};

export default {
    title: 'Board/Consume',
    component: Board // enable this to be able to use all args in your component. See https://storybook.js.org/docs/react/essentials/controls and https://storybook.js.org/docs/react/writing-stories/args
};

export const SameronDemo = (args, { globals: { theme, locale }}) => {
    const boardInfo = BoardInfo.fromObject(SameronBoard);
    const authenticationParameters = useAuthParams();    

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={boardStyle}>
            <Board
                theme={theme}
                locale={locale}
                boardInfo={boardInfo}
                // TODO: Creating these adapters should probably happen outside of rendering
                // but authenticationParameters are not guaranteed to be null.
                adapter={new ADTAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    )
                )} />
        </div>
    );
}

export const Tsi = (args, { globals: { theme, locale } }) => {
    const boardInfo = BoardInfo.fromObject(TestAsv);
    const authenticationParameters = useAuthParams();
    const searchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={boardStyle}>
            <Board
                theme={theme}
                locale={locale}
                searchSpan={searchSpan}
                boardInfo={boardInfo}
                // TODO: Creating these adapters should probably happen outside of rendering
                // but authenticationParameters are not guaranteed to be null.
                adapter={new TsiAdapter(
                    authenticationParameters.tsi.environmentFqdn,
                    new MsalAuthService(
                        authenticationParameters.tsi.aadParameters
                    )
                )} />
        </div>
    );
};
