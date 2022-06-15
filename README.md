![build](https://github.com/microsoft/iot-cardboard-js/workflows/build/badge.svg?branch=main) [![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://main--601c6b2fcd385c002100f14c.chromatic.com) ![npm (tag)](https://img.shields.io/npm/v/@microsoft/iot-cardboard-js/beta)
# Quick start 📦
## What is **iot-cardboard-js**?
**iot-cardboard-js** or *Cardboard* is an open source React component library for creating internet of things (IoT) web experiences.  

The components in Cardboard are also used for building the experiences in [Azure Digital Twins 3D Scenes Studio](https://explorer.digitaltwins.azure.net/3dscenes/demo), and can be leveraged by Azure Digital Twins customers in their own applications.  Learn more about leveraging Cardboard components for 3D Scenes in the [wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Embedding-3D-Scenes).

The 3D visualization components in this library leverage the fantastic [BabylonJS](https://www.babylonjs.com/) library under the hood.  If you haven't used it yet, we can't say enough great things about the library, definitely check it out!

Viewer Mode
![image](https://user-images.githubusercontent.com/57726991/173465604-844492d1-89c8-4378-8bd7-131ef966002a.png)

Builder mode
![image](https://user-images.githubusercontent.com/57726991/173465578-93eb1b54-e1b5-40a6-944c-9185c5fb14ca.png)

## Storybook 📖
This project is developed using Storybook - an open source tool for building UI components in isolation.  Our [hosted storybook](https://main--601c6b2fcd385c002100f14c.chromatic.com) showcases the current library of **iot-cardboard-js** components.  [Learn more about Storybook](https://storybook.js.org/).
> Note: stories which require authentication or API interaction can be found in the local development storybook. 

## Using **iot-cardboard-js** components 🔥
### Installing
Install our `beta` package from npm with:

`npm install @microsoft/iot-cardboard-js@beta`

### Styles
Import the **iot-cardboard-js** themes stylesheet at the top level of your application to get theming for cardboard components via CSS custom properties (variables).
These variables can be edited if you'd like to change theme colors.

```tsx
import '@microsoft/iot-cardboard-js/themes.css';
```

### Importing components via named exports

``` tsx
import {
    StandalonePropertyInspector,
    ADTAdapter,
    MsalAuthService,
    KeyValuePairCard,
    //...
} from '@microsoft/iot-cardboard-js';
```

This is the easiest method of importing components and, in most cases, will allow unused code to be tree shaken from our library.
If, however, you only need a few modules from our library, you can use the direct import pattern to be more explicit about what code is imported.

### Importing components via direct imports

Adapters, Classes, Constants, Hooks, and Services each have their own entry point and can be imported as follows.

**Adapters**: 
```tsx
import { AdtAdapter } from '@microsoft/iot-cardboard-js/Adapters'
```

**Classes**: 
```tsx
import { SearchSpan } from '@microsoft/iot-cardboard-js/Classes'
```

**Constants**: 
```tsx
import { IMockAdapter } from '@microsoft/iot-cardboard-js/Constants'
```

**Hooks**: 
```tsx
import { useGuid } from '@microsoft/iot-cardboard-js/Hooks'
```

**Services**: 
```tsx
import { MsalAuthService, getFileType } from '@microsoft/iot-cardboard-js/Services'
```

All Cards and Components have their own direct import path.

**Cards**:
```tsx
import KeyValuePairCard from '@microsoft/iot-cardboard-js/Cards/KeyValuePairCard'
```

**Components**:
```tsx
import StandalonePropertyInspector from '@microsoft/iot-cardboard-js/Components/StandalonePropertyInspector'
```


### Examples

Storybook stories are the best way to learn how to use our components.  Files ending in `*.stories.tsx` showcase components set up with mock data.  While files ending in `*.stories.local.tsx` showcase components which authenticate and communicate with APIs. Stories are a great way to learn about the different ways to consume each of our components.

Check out the [KeyValuePairCard](https://github.com/microsoft/iot-cardboard-js/blob/main/src/Cards/KeyValuePairCard/KeyValuePairCard.stories.tsx) stories for an example of this.

You can also see the code required to use a component by opening either the [live](https://601c6b2fcd385c002100f14c-exzabxrkak.chromatic.com/?path=/docs/keyvaluepaircard-consume--mock) or local storybook, selecting the **docs** tab at the top of a story, and clicking **show code** at the bottom right of a story panel.  This opens a view of the code used to render that story!

## Questions for maintainers 🙏
If you have a question for one of the project maintainers, please post the question [here](https://github.com/microsoft/iot-cardboard-js/discussions/categories/q-a).  We'll get back to you as soon as possible!

### Issue templates
- [File a bug](https://github.com/microsoft/iot-cardboard-js/issues/new?assignees=&labels=bug+%3Abug%3A&template=bug-report.md&title=) 🐛
- [Request a new feature](https://github.com/microsoft/iot-cardboard-js/issues/new?assignees=&labels=enhancement+%3Abulb%3A&template=feature_request.md&title=) 💡

## Contributing 🚀
- To contribute to this project, head over to our [environment setup wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Environment-setup) to get started.
- To learn about our codebase philosophy, check out the [design patterns wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Design-patterns).
- To learn about coding guidelines, check out the [coding guidelines wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Coding-guidelines~Component-templates).
- For an overview of our CI / CD and semantic versioning systems, check out our [continuous integration and delivery wiki](https://github.com/microsoft/iot-cardboard-js/wiki/Continuous-delivery).


## Contributor License Agreement 📃

This project welcomes contributions and suggestions!  Most contributions require you to agree to a
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
