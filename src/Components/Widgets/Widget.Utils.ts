import { DTwin } from '../../Models/Constants/Interfaces';
import { parseExpression } from '../../Models/Services/Utils';

export function performSubstitutions(
    expression: string,
    twins: Record<string, DTwin>
) {
    while (expression) {
        const n = expression.indexOf('${');
        if (n < 0) {
            break;
        }

        const m = expression.indexOf('}', n + 1);
        if (m < 0) {
            break;
        }

        const sub = expression.substring(n + 2, m);
        const target = parseExpression(sub, twins);
        expression =
            expression.substring(0, n) + target + expression.substring(m + 1);
    }

    return expression;
}
