import { View } from "react-native";
import { useSearchParams } from "expo-router";

import { Text } from "~/ui";
import { TemplateEditor } from "~/features/TemplateEditor";

const UpdateTemplate = () => {
  const { templateId } = useSearchParams();

  return <TemplateEditor templateId={templateId} />;
};

export default UpdateTemplate;
