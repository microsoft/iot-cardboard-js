# Localization

## Summary

We use a custom fork of [i18n-auto-translation](https://github.com/msnyder-msft/i18n-auto-translation-msnyder) package for generating first passes on localized strings. The goal in the long run is to then iterate on these auto generated values with professional translations.

## How to update locales

- By default the localization package will only fetch translations for *new* keys added when you first push that key to your branch in the `en.json` file.
- If you *update* an existing string the package will not see it. You'll need to use a new key or remove the key, run the command, and add it back to get it to pick up the new string.
- To force update all the strings, simply drop all the non-english files and run the translation process.

```ts
npm install -g i18n-auto-translation-msnyder
```

To translate one language

```ts
i18n-auto-translation-msnyder -t de -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -a azure-official 
```

To translate all languages
 
```ts
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t cs
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t de
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t es
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t fr
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t hu
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t it
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t ja
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t ko
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t nl
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t pl
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t pt
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t pt-pt
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t ru
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t sv
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t tr
i18n-auto-translation-msnyder -a azure-official -k SUBSCRIPTION_KEY -p ./src/Resources/Locales/en.json -l westus2 -f en -t zh-Hans
```

## Handling merge conflicts

If you get into a situation where you have to deal with a merge conflict, you can simply revert your changes to the non-english files and then let it retranslate your strings.

1. backup your `en.json` changes
1. revert non-en changes `git checkout origin/main src/Resources/Locales`
1. Commit & push the non-english files
1. Reapply your backup for `en.json`
1. Merge with main (or swap these steps if it's easier)
1. Commit & push the `en.json` changes

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

- Čeština - CS
- Deutsch - DE
- English - EN
- Español - ES
- Français - FR
- Magyar - HU
- Italiano - IT
- 日本語 - JA
- 한국어 - KO
- Nederlands - NL
- Polski - PL
- Português - PT
- Русский - RU
- Svenska - SV
- Türkçe - TR
- Chinese - ZH
