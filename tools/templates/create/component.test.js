module.exports = (componentName) => ({
    content: `describe('${componentName}', () => {
    test.todo('Add test');
});
`,
    extension: `.test.tsx`
});
