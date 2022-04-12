# Localization

## Summary

We use a custom fork of [i18n-auto-translation](https://github.com/msnyder-msft/i18n-auto-translation-msnyder) package for generating first passes on localized strings. The goal in the long run is to then iterate on these auto generated values with professional translations.

## How to update locales

- By default the localization package will only fetch translations for *new* keys when you first push that key to your branch.
- If you *update* an existing string the package will not see it. You'll need to use a new key or remove the key, run the command, and add it back to get it to pick up the new string.
- To force update all the strings, simply drop all the non-english files and run the translation process.

```ts
npm install -g i18n-auto-translation-msnyder
```

```ts
i18n-auto-translation-msnyder -t de -k <subscription key> -p ./src/Resources/Locales/en/translation.json -l westus2 -f en -a azure-official 
```

## Adding/removing a language

- Add to the list of languages to translate in the build yml `.github/workflows/translation.yml`
- Update the list of languages in the `preview.js` file for storybook
- Add the language to the num in `Models/Contants/Enums.ts`
- Import your newly generated file and map it to the enum in `i18n.ts`

## Translation automation

- In the PRs we have a GitHub action ([i18n-auto-translation-action](https://github.com/msnyder-msft/i18n-auto-translation-action)) that gets triggered to run this package automatically. It will push updates to the PR for the newly detected keys.

## Quick tricks

- To delete a key in all the files simply remove it from your english file, trigger the run using the above command and then add your key back.

## Other notes

Today we translate these languages

- cs
- de
- en
- es
- fr
- hu
- it
- ja
- ko
- nl
- pl
- pt
- pt-pt
- ru
- sv
- tr
- zh-Hans
