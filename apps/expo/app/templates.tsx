import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

import { Anchor, Layout, Loader, SafeAreaView, Text } from "~/ui";
import { useTemplates } from "~/api";

const Templates = () => {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates();

  return (
    <SafeAreaView>
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>Templates</Layout.Title>
            <Anchor onPress={() => router.push("/template/new")}>New template</Anchor>
          </View>
          <Layout.Description>
            Here you can manage the templates that are referenced in your plans and workouts
          </Layout.Description>
        </Layout.Header>
        <Layout.Content>
          {isLoading ? (
            <View className="h-full w-full flex-1 items-center justify-center">
              <Loader />
            </View>
          ) : (
            <ScrollView className="p-base">
              {templates?.map((template, index) => {
                const isFirst = index === 0;
                const isLast = index === templates.length - 1;
                return (
                  <View
                    key={template.id}
                    className={clsx(
                      "border-2 border-primary-normal p-sm",
                      isFirst ? "rounded-t-md" : "",
                      isLast ? "rounded-b-md" : "border-b-0",
                    )}
                  >
                    <View className="p-sm sm:px-lg">
                      <View className="flex-row items-center justify-between">
                        <Text weight="medium" className="truncate text-base capitalize text-primary-normal">
                          {template.name}
                        </Text>
                        <View className="space-x-md">
                          <Anchor onPress={() => router.push(`/template/${template.id}`)}>Edit</Anchor>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </Layout.Content>
      </Layout>
    </SafeAreaView>
  );
};

export default Templates;
