![build](https://github.com/microsoft/iot-cardboard-js/workflows/build/badge.svg?branch=main) [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://main--601c6b2fcd385c002100f14c.chromatic.com) ![npm (tag)](https://img.shields.io/npm/v/@microsoft/iot-cardboard-js/beta)
# Quick start 📦
## What is **iot-cardboard-js**?
**iot-cardboard-js** or *cardboard* is an open source React component library for creating internet of things (IoT) web experiences.


## Storybook 📖
This project is developed using Storybook - an open source tool for building UI components in isolation.  Our [hosted storybook](https://main--601c6b2fcd385c002100f14c.chromatic.com) showcases the current library of **iot-cardboard-js** components.  [Learn more about Storybook](https://storybook.js.org/).
> Note: Stories which require authentication or API interaction can be found in the local development storybook. 

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

## Questions for maintainers 🙏
If you have a question for one of the project maintainers, please post the question [here](https://github.com/microsoft/iot-cardboard-js/discussions/categories/q-a).  We'll get back to you as soon as possible!

### Issue templates
- [File a bug](https://github.com/microsoft/iot-cardboard-js/issues/new?assignees=&labels=bug+%3Abug%3A&template=bug-report.md&title=) 🐛
- [Request a new feature](https://github.com/microsoft/iot-cardboard-js/issues/new?assignees=&labels=enhancement+%3Abulb%3A&template=feature_request.md&title=) 💡

## Contributing 🚀
- To contribute to this project, head over to our [contribution guidelines wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Contributing-%F0%9F%9A%80) to get started.
- To learn about our codebase philosophy, check out the [design patterns wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Design-patterns).
- For an overview of our CI / CD and semantic versioning systems, check out our [continuous integration and delivery wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Continuous-integration-and-delivery-%F0%9F%94%8E).

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
