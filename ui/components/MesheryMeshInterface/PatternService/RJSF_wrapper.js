import React from "react";
import HandleError from '../../ErrorHandling';
import { buildUiSchema, recursiveCleanObjectExceptEmptyArray } from "../helpers";
import { getRefinedJsonSchema } from "./helper";
// import MesheryArrayFieldTemplate from "./RJSFCustomComponents/ArrayFieldTemlate";
// import MesheryCustomObjFieldTemplate from "./RJSFCustomComponents/ObjectFieldTemplate";
import _ from "lodash";
import RJSFForm from './RJSF';


function RJSFWrapper(props) {
  const {
    formData,
    jsonSchema,
    onChange,
    hideTitle,
    RJSFWrapperComponent = React.Fragment,
    //.. temporarily ignoring till handler is attached successfully
  } = props;

  const errorHandler = HandleError();

  const [data, setData] = React.useState(prev => ({ ...formData, ...prev }));
  const [schema, setSchema] = React.useState({ rjsfSchema : {}, uiSchema : {} })
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Apply debouncing mechanism for the state propagation
    const timer = setTimeout(() => {
      // callback fired, that triggers save operations, and other related side-effects
      onChange?.(data);
    }, 400);

    return () => clearTimeout(timer);
  }, [data]);

  React.useEffect(() => {
    const rjsfSchema = getRefinedJsonSchema(jsonSchema, hideTitle, errorHandler)
    // UI schema builds responsible for customizations in the RJSF fields shown to user
    const uiSchema = buildUiSchema(rjsfSchema)
    setSchema({ rjsfSchema, uiSchema });
  }, [jsonSchema]) // to reduce heavy lifting on every react render

  React.useEffect(() => {
    if (!_.isEqual(schema, { rjsfSchema : {}, uiSchema : {} })) {
      setTimeout(() => {
        setIsLoading(false);
      }, 300); // for showing circular progress
    }
  }, [schema])

  return (
    <RJSFWrapperComponent {...props}>
      <RJSFForm
        isLoading={isLoading}
        schema={schema}
        data={data}
        onChange={(e) => {
          // the object that has to cleaned before feeding into the RJSF form
          // that helps us in coping overzealous validation issues
          const cleanedData = { ...e.formData };
          recursiveCleanObjectExceptEmptyArray(cleanedData);
          setData(cleanedData);
        }}
        jsonSchema={jsonSchema}
      />
    </RJSFWrapperComponent>
  );
}

export default RJSFWrapper;
