![build](https://github.com/microsoft/iot-cardboard-js/workflows/build/badge.svg?branch=main) [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://main--601c6b2fcd385c002100f14c.chromatic.com) ![npm (tag)](https://img.shields.io/npm/v/@microsoft/iot-cardboard-js/beta)
# Quick start 📦
## What is **iot-cardboard-js**?
**iot-cardboard-js** or *cardboard* is an open source React component library for creating internet of things (IoT) web experiences.


## Storybook 📖
This project is developed using Storybook - an open source tool for building UI components in isolation.  Our [hosted storybook](https://main--601c6b2fcd385c002100f14c.chromatic.com) showcases the current library of **iot-cardboard-js** components.  [Learn more about Storybook](https://storybook.js.org/).
> Note: Stories which require authentication or API interaction can be found in the local development storybook. 

## Questions for maintainers 🙏
If you have a question for one of the project maintainers, please post the question [here](https://github.com/microsoft/iot-cardboard-js/discussions/categories/q-a).  We'll get back to you as soon as possible!
## Using **iot-cardboard-js** components 🔥
### Installing
Install our `beta` package from npm with:

`npm install @microsoft/iot-cardboard-js@beta`

Import components into your app:
``` tsx
import {
    StandalonePropertyInspector,
    ADTAdapter,
    MsalAuthService,
    KeyValuePairCard,
    //...
} from 'iot-cardboard-js';
```

### Examples

Storybook stories are the best way to learn how to use our components.  Files ending in `*.stories.tsx` showcase components set up with mock data.  While files ending in `*.stories.local.tsx` showcase components which authenticate and communicate with APIs. Stories are a great way to learn about the different ways to consume each of our components.

Check out the [KeyValuePairCard](src/Cards/KeyValuePairCard/Consume/KeyValuePairCard.stories.tsx) stories for an example of this.

You can also see the code required to use a component by opening either the [live](https://601c6b2fcd385c002100f14c-exzabxrkak.chromatic.com/?path=/docs/keyvaluepaircard-consume--mock) or local storybook, selecting the **docs** tab at the top of a story, and clicking **show code** at the bottom right of a story panel.  This opens a view of the code used to render that story!
## Contributing 🚀
### Setting up local development
1. Clone this repository.
2. Open this project in VS code
3. Install the [recommended VS Code extensions](#recommended-vs-code-extensions)
4. Add `127.0.0.1 <your_callback_url>` to your hosts file.  A valid callback URL is required for auth tokens in local development.
    - Windows `hosts` file path: `C:\Windows\System32\drivers\etc`
    - Mac `hosts` file path: `/etc/hosts`
5. `npm install` to install this project's dependencies
7.  Create a `secrets.user.js` file in the `.storybook/` folder using the [`secrets.placeholder.js`](.storybook/secrets.placeholder.js) file as a template.
8. `npm run storybook` starts the local development storybook.  Navigate to the callback URL you entered in the `secrets.user.js` file to see the development storybook!

> Note: If you have any questions about setting up your hosts file, configuring your development secrets, or any other local development setup issues, please contact one of the [maintainers](#questions-for-maintainers-🙏)

### Important npm scripts
|Command (prefix with `npm run`)|Effect|
|----|-------|
|`build`|Bundles library with rollup.js|
|`storybook`|Starts Storybook UI component explorer|
|`test`| Run jest test suite|
|`test:watch`| Run tests in hot-reloading *watch* mode|
|`lint`| Formats code to conform to *prettier* and *stylelint* format|
|`lint:check`| Checks for *eslint*, *prettier*, and *stylelint* formatting errors/warnings.|

### Recommended VS Code extensions
We recommend you install the following vs-code extensions to streamline the code quality and linting process.
|Name|Purpose|
|----|-------|
|Prettier - Code formatter| Enforces a [consistent style](https://prettier.io/docs/en/why-prettier.html) by parsing your code and re-printing it. To ensure that this extension is used over other extensions you may have installed, be sure to set it as the [default formatter](https://github.com/prettier/prettier-vscode#default-formatter) in your VS Code settings. This setting can be set for all languages or by a specific language. To allow for auto-linting on file save, you must have the default formatter set as `prettier-vscode` and have `Editor: format on save` checked.  These settings can be changed in your VS Code preferences.|
|ESLint| Integrates ESLint into VS Code. If you are new to ESLint check the [documentation](https://eslint.org/).|
|stylelint| A Visual Studio Code extension to lint CSS/SCSS/Less with [stylelint](https://stylelint.io/)|

## Contributor License Agreement 📃

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.


## Code of conduct 📏

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks ™️

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft 
trademarks or logos is subject to and must follow 
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
