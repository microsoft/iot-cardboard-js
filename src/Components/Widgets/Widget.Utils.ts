import { Parser } from 'expr-eval';

export function performSubstitutions(expression: string, twins: any) {
    while (expression) {
        const n = expression.indexOf('${');
        if (n < 0) {
            break;
        }

        const m = expression.indexOf('}', n + 1);
        if (m < 0) {
            break;
        }

        let sub = expression.substring(n + 2, m);
        sub = sub.replace('.displayName', '.$dtId'); // TODO: Hack
        const target = (Parser.evaluate(sub, twins) as any) as string;
        expression =
            expression.substring(0, n) + target + expression.substring(m + 1);
    }

    return expression;
}
