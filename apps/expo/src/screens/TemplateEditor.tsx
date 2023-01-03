import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-get-random-values';
import { useAtom } from 'jotai';
import { useFocusEffect } from '@react-navigation/native';

import { Layout } from '@ui/layout/Layout';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import { Text } from '@ui/typography/Text';
import { Loader } from '@ui/feedback/Loader';
import { Dialog } from '@ui/overlays/Dialog';
import { Button } from '@ui/buttons/Button';

import { ExerciseSelectTab, templateEditorStepsCompletedAtom } from '@/components/TemplateEditor/ExerciseSelect';
import { SetsAndRepsTab, templateSubmittedAtom } from '@/components/TemplateEditor/SetsAndReps';
import type { RootStackParamList } from '@/_app';
import { TemplateProvider } from '@/stores/local/TemplateProvider';
import { trpc } from '@/trpc';
import { Anchor } from '@/components/ui/navigation/Anchor';
import { Stepper } from '@/components/ui/navigation/Stepper';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TemplateEditorTabParamList = {
  ExerciseSelect: { isTemplateNew: boolean };
  SetsAndReps: { isTemplateNew: boolean };
};

const Tab = createBottomTabNavigator<TemplateEditorTabParamList>();

type Props = StackScreenProps<RootStackParamList, 'TemplateEditor'>;

export const TemplateEditorScreen = ({ route, navigation }: Props) => {
  const [submitted, setSubmitted] = useAtom(templateSubmittedAtom);
  const templateId = route?.params?.templateId ?? null;

  const {
    data: template,
    isError: isTemplateError,
    isFetching: isTemplateFetching,
    refetch,
  } = trpc.template.byId.useQuery({ id: templateId! }, { enabled: !!templateId });

  const deleteMutation = trpc.template.delete.useMutation({
    onSuccess: () => {
      if (navigation.canGoBack()) navigation.goBack();
    },
  });

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleCloseDeleteModal = () => {
    if (!deleteMutation.isLoading) setIsDeleteModalVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      if (templateId) refetch();
    }, [refetch, templateId]),
  );

  useEffect(() => {
    if (submitted) {
      setSubmitted(false);
      navigation.goBack();
    }
  }, [submitted, navigation, setSubmitted]);

  if (isTemplateError) {
    return (
      <SafeAreaView className="items-center justify-center">
        <Text>Oh no... An error occurred!</Text>
      </SafeAreaView>
    );
  }

  return (
    <TemplateProvider template={template || null} isLoading={isTemplateFetching || false}>
      <SafeAreaView>
        {templateId && (
          <Dialog open={isDeleteModalVisible} onClose={handleCloseDeleteModal} intent="danger">
            <Dialog.Icon />
            <Dialog.Content>
              <Dialog.Title>Delete {template?.name ? `"${template.name}"` : 'Template'}?</Dialog.Title>
              <Dialog.Description>
                Are you sure you want to delete this template? All of the data attached to this template will be deleted
                forever. This action cannot be undone.
              </Dialog.Description>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                intent="danger"
                onPress={() => deleteMutation.mutate(templateId)}
                loading={deleteMutation.isLoading}
              >
                <Button.Text>{deleteMutation.isLoading ? 'Deleting Template...' : 'Delete Template'}</Button.Text>
              </Button>
              <Button intent="tertiary" onPress={handleCloseDeleteModal} className="mt-md">
                <Button.Text>Cancel</Button.Text>
              </Button>
            </Dialog.Actions>
          </Dialog>
        )}

        <Layout>
          <Layout.Header>
            <Layout.BackButton />
            <View className="flex-row items-center justify-between">
              <Layout.Title>{templateId ? 'Update Template' : 'Create Template'}</Layout.Title>
              {templateId && (
                <Anchor intent="danger" onPress={() => setIsDeleteModalVisible(true)}>
                  Delete exercise
                </Anchor>
              )}
            </View>
            <Layout.Description>Configure this workout template</Layout.Description>
          </Layout.Header>
          <Layout.Content>
            {templateId && isTemplateFetching ? (
              <View className="flex-1 items-center justify-center">
                <Loader />
              </View>
            ) : (
              <Tab.Navigator
                sceneContainerStyle={{ backgroundColor: 'transparent' }}
                screenOptions={{ headerShown: false, tabBarStyle: { position: 'absolute' } }}
                tabBar={(props) => <TabBars {...props} />}
              >
                <Tab.Screen
                  name="ExerciseSelect"
                  component={ExerciseSelectTab}
                  options={{ title: 'Select Exercises' }}
                  initialParams={{
                    isTemplateNew: !!route?.params?.templateId,
                  }}
                />
                <Tab.Screen
                  name="SetsAndReps"
                  component={SetsAndRepsTab}
                  options={{ title: 'Sets & Reps' }}
                  initialParams={{
                    isTemplateNew: !!route?.params?.templateId,
                  }}
                />
              </Tab.Navigator>
            )}
          </Layout.Content>
        </Layout>
      </SafeAreaView>
    </TemplateProvider>
  );
};

const TabBars = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [stepsCompleted] = useAtom(templateEditorStepsCompletedAtom);

  return (
    <View className="mt-sm px-base pb-base">
      <Stepper active={state.index} className="space-x-md">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          return (
            <Stepper.Step
              onPress={() => navigation.navigate(route.name)}
              key={index}
              index={index}
              allowStepSelect={stepsCompleted >= index}
            >
              {label}
            </Stepper.Step>
          );
        })}
      </Stepper>
    </View>
  );
};
