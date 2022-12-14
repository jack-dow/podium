import type { StackScreenProps } from '@react-navigation/stack';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-get-random-values';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import { PortalProvider } from '@gorhom/portal';
import { useFocusEffect } from '@react-navigation/native';

import { Layout } from '@ui/layout/Layout';
import { SafeAreaView } from '@ui/layout/SafeAreaView';
import { Text } from '@ui/typography/Text';
import { Loader } from '@ui/feedback/Loader';
import { Dialog } from '@ui/overlays/Dialog';
import { Button } from '@ui/buttons/Button';

import { ExerciseSelectTab, stepsCompletedAtom } from '@/components/TemplateEditor/ExerciseSelect';
import { SetsAndRepsTab, templateSubmittedAtom } from '@/components/TemplateEditor/SetsAndReps';
import type { RootStackParamList } from '@/_app';
import { TemplateProvider } from '@/stores/local/TemplateProvider';
import { trpc } from '@/trpc';
import { Anchor } from '@/components/ui/navigation/Anchor';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabNavigationParamList = {
  ExerciseSelect: { isTemplateNew: boolean };
  SetsAndReps: { isTemplateNew: boolean };
};

const Tab = createBottomTabNavigator<TabNavigationParamList>();

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
        <PortalProvider>
          {templateId && (
            <Dialog open={isDeleteModalVisible} onClose={handleCloseDeleteModal} intent="danger">
              <Dialog.Icon />
              <Dialog.Content>
                <Dialog.Title>Delete {template?.name ? `"${template.name}"` : 'Template'}?</Dialog.Title>
                <Dialog.Description>
                  Are you sure you want to delete this template? All of the data attached to this template will be
                  deleted forever. This action cannot be undone.
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

          <Layout
            title={templateId ? 'Update Template' : 'Create Template'}
            description="Configure this workout template"
            titleRightSection={
              templateId && (
                <Anchor intent="danger" onPress={() => setIsDeleteModalVisible(true)}>
                  Delete exercise
                </Anchor>
              )
            }
          >
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
          </Layout>
        </PortalProvider>
      </SafeAreaView>
    </TemplateProvider>
  );
};

const TabBars = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const [stepsCompleted] = useAtom(stepsCompletedAtom);

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const isDisabled = stepsCompleted < index;

          const handlePress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <View key={route.key} className={clsx('flex-1', index === 0 ? 'pr-base' : 'pr-none')}>
              <Pressable
                onPress={handlePress}
                disabled={isDisabled}
                className={clsx(
                  'w-full border-t-4 pt-base',
                  isFocused ? 'border-primary-active' : 'border-primary-normal',
                  isDisabled ? 'opacity-30' : 'opacity-100',
                )}
              >
                {({ pressed }) => {
                  return (
                    <>
                      <Text
                        weight="bold"
                        className={clsx(
                          'text-sm uppercase',
                          isFocused
                            ? 'text-interactive-primary-normal'
                            : pressed
                            ? 'text-interactive-primary-active'
                            : 'text-primary-muted',
                        )}
                      >
                        Step {index + 1}
                      </Text>
                      <Text weight="medium" className="text-sm">
                        {label}
                      </Text>
                    </>
                  );
                }}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};
