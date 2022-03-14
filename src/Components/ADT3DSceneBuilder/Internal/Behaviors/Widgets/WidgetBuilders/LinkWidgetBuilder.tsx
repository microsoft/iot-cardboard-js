// TODO SCHEMA MIGRATION -- update LinkWidgetBuilder to new schema / types
// import { TextField } from '@fluentui/react';
// import produce from 'immer';
// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { IWidgetBuilderFormDataProps } from '../../../../ADT3DSceneBuilder.types';

// const LinkWidgetBuilder: React.FC<IWidgetBuilderFormDataProps> = ({
//     formData,
//     setFormData
// }) => {
//     const { t } = useTranslation();
//     return (
//         <div>
//             <TextField
//                 label={t('label')}
//                 value={formData.controlConfiguration.label}
//                 onChange={(_ev, newVal) =>
//                     setFormData(
//                         produce((draft) => {
//                             draft.controlConfiguration.label = newVal;
//                         })
//                     )
//                 }
//             />
//             <TextField
//                 label={t('url')}
//                 description={t('3dSceneBuilder.linkWidgetUrlDescription')}
//                 placeholder="https://mypowerbi.biz/${LinkedTwin.$dtId}"
//                 value={formData.controlConfiguration.expression}
//                 onChange={(_ev, newVal) =>
//                     setFormData(
//                         produce((draft) => {
//                             draft.controlConfiguration.expression = newVal;
//                         })
//                     )
//                 }
//             />
//         </div>
//     );
// };

// export default LinkWidgetBuilder;
