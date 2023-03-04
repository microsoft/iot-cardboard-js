import { AuthTokenTypes, IAuthService } from '../../../../Models/Constants';
import { IPowerBIWidgetBuilderAdapter } from './PowerBIWidgetBuilder.types';
import { service, factories, Report } from 'powerbi-client';
import { createGUID } from '../../../../Models/Services/Utils';
import { TokenType } from 'powerbi-models';

const powerBIService = new service.Service(
    factories.hpmFactory,
    factories.wpmpFactory,
    factories.routerFactory
);
export default class PowerBIWidgetBuilderAdapter
    implements IPowerBIWidgetBuilderAdapter {
    authService: IAuthService;
    element: HTMLDivElement;
    report: Report;
    constructor(authService: IAuthService) {
        this.authService = authService;
        // Power BI SDK relies on being loaded into an HTML elevement
        const guid = createGUID();
        this.element = document.createElement('div');
        this.element.id = guid;
        this.element.style.display = 'none';
        this.element.hidden = true;
    }
    getVisualsOnPage = async (reportUrl: string, pageName: string) => {
        if (!reportUrl || !pageName) {
            return [];
        }
        const report = await this.getReport(reportUrl);
        const page = await report?.getPageByName(pageName);
        const visuals = await page?.getVisuals();
        return visuals?.map((v) => {
            return {
                name: v.name,
                title: v.title,
                type: v.type
            };
        });
    };
    getPagesInReport = async (reportUrl: string) => {
        if (!reportUrl) {
            return [];
        }
        const report = await this.getReport(reportUrl);
        return await report?.getPages();
    };
    getReport = async (reportUrl: string) => {
        if (this.report?.config?.embedUrl === reportUrl) {
            return this.report;
        }
        const isNew = !this.report;
        this.report = powerBIService.embed(this.element, {
            type: 'report',
            accessToken: await this.authService.getToken(
                AuthTokenTypes.powerBI
            ),
            embedUrl: reportUrl,
            settings: {
                filterPaneEnabled: false,
                navContentPaneEnabled: false
            },
            tokenType: TokenType.Embed
        }) as Report;
        if (!isNew) {
            // If we changed things, we need to reload the report
            await this.report.reload();
        }

        return this.report;
    };
}
