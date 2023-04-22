import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Anchor, Fallback, Layout, Loader, SafeAreaView } from "~/ui";
import { useTemplate, useTemplateInsertMutation, useTemplateUpdateMutation } from "~/api";
import { TemplateContext, type TemplateStoreState } from "~/contexts/TemplateContext";
import { TemplateEditorExerciseSelectTab } from "./TemplateEditorExerciseSelectTab";
import { TemplateEditorSetEditorTab } from "./TemplateEditorSetEditorTab";
import { TemplateEditorTabBar } from "./TemplateEditorTabBar";

export type TemplateEditorTabParamList = {
  TemplateEditorExerciseSelect: undefined;
  TemplateEditorSetEditor: undefined;
};

const Tab = createBottomTabNavigator<TemplateEditorTabParamList>();

type TemplateEditorProps = {
  templateId?: string;
};

export const TemplateEditor = ({ templateId }: TemplateEditorProps) => {
  const router = useRouter();

  const { data: template, isLoading, error, isFetching } = useTemplate(templateId);

  const templateInsertMutation = useTemplateInsertMutation();
  const templateUpdateMutation = useTemplateUpdateMutation(templateId);

  const handleSubmit: TemplateStoreState["handleSubmit"] = (data) => {
    function onSuccess() {
      router.back();
    }

    function onError(error: unknown) {
      console.log("Failed to submit template", { error });
    }

    if (templateId) {
      templateUpdateMutation.mutate(data, { onSuccess, onError });
    } else {
      templateInsertMutation.mutate(data, { onSuccess, onError });
    }
  };

  return (
    <TemplateContext.Provider value={{ template, isLoading, handleSubmit }}>
      <SafeAreaView>
        <Layout>
          <Layout.Header>
            <Layout.BackButton />
            <View className="flex-row items-center justify-between">
              <Layout.Title>{templateId ? "Update Template" : "Create Template"}</Layout.Title>
              {!templateId && <Anchor intent="danger">Delete exercise</Anchor>}
            </View>
            <Layout.Description>Configure this workout template</Layout.Description>
          </Layout.Header>
          <Fallback
            isLoading={isFetching}
            fallback={
              <View className="flex-1 items-center justify-center">
                <Loader />
              </View>
            }
          >
            <Layout.Content>
              <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: "transparent" }}
                screenOptions={{ headerShown: false, tabBarStyle: { position: "absolute" } }}
                tabBar={(props) => <TemplateEditorTabBar {...props} />}
              >
                <Tab.Screen
                  name="TemplateEditorExerciseSelect"
                  component={TemplateEditorExerciseSelectTab}
                  options={{ title: "Select Exercises" }}
                />
                <Tab.Screen
                  name="TemplateEditorSetEditor"
                  component={TemplateEditorSetEditorTab}
                  options={{ title: "Sets & Reps" }}
                />
              </Tab.Navigator>
            </Layout.Content>
          </Fallback>
        </Layout>
      </SafeAreaView>
    </TemplateContext.Provider>
  );
};
