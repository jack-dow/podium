import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";

import { Anchor, Button, Dialog, Layout, Loader, OverlayManager, SafeAreaView, Text } from "~/ui";
import { useTemplates } from "~/api";
import { db } from "~/api/drizzle";
import { templates } from "~/api/schema/templates";

const TemplateClearConfirmDialog = OverlayManager.register(() => {
  const { visible, hide } = OverlayManager.useOverlay(TemplateClearConfirmDialog);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await db.delete(templates).all();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["templates"]);
    },
  });

  return (
    <Dialog open={visible} onClose={hide} intent="danger">
      <Dialog.Icon />
      <Dialog.Content>
        <Dialog.Title>Clear all templates? (DEV ONLY)</Dialog.Title>
        <Dialog.Description>
          Are you sure? This will delete all of the templates in your database. This action cannot be undone.
        </Dialog.Description>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          intent="danger"
          onPress={() =>
            mutation.mutate(undefined, {
              onSuccess() {
                hide();
              },
            })
          }
          loading={mutation.isLoading}
        >
          <Button.Text>{mutation.isLoading ? "Deleting templates..." : "Delete exercise"}</Button.Text>
        </Button>
        <Button intent="tertiary" onPress={hide} className="mt-md">
          <Button.Text>Cancel</Button.Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
});

const Templates = () => {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates();

  const TemplateClearConfirmDialogAPI = OverlayManager.useOverlayAPI(TemplateClearConfirmDialog);

  return (
    <SafeAreaView>
      <TemplateClearConfirmDialog />
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>Templates</Layout.Title>
            <View>
              <Anchor intent="danger" onPress={() => TemplateClearConfirmDialogAPI.show()}>
                Clear Templates (DEV ONLY)
              </Anchor>
              <Anchor onPress={() => router.push("/template/new")}>New template</Anchor>
            </View>
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
