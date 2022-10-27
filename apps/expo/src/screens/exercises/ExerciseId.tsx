import React, { useEffect, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, Text, View, useDripsyTheme } from 'dripsy';
import { Modal, useWindowDimensions } from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import type { RootStackParamList } from '@/_app';
import { Layout } from '@/components/layout/Layout';
import { ExerciseEditor } from '@/components/screens/ExerciseEditor';
import { trpc } from '@/utils/trpc';
import { SafeAreaView } from '@/components/layout/SafeAreaView';
import { Anchor } from '@/components/navigation/Anchor';
import { ExclamationTriangleIcon } from '@/assets/icons/outline/ExclamationTriangle';
import { Button } from '@/components/buttons/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseId'>;

export const ExerciseIdScreen = ({ navigation, route }: Props) => {
  const { width } = useWindowDimensions();
  const { theme } = useDripsyTheme();
  const { exerciseId } = route.params;
  const { data: exercise, isLoading, isError, refetch } = trpc.exercises.byId.useQuery({ id: exerciseId });
  const updateMutation = trpc.exercises.update.useMutation({
    onSuccess() {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });
  const deleteMutation = trpc.exercises.delete.useMutation({
    onSuccess() {
      setIsDeleteModalVisible(false);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    },
  });

  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused, refetch]);

  if (isError) {
    return (
      <View>
        <Text>An error occurred...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <Layout
        title="Update Exercise"
        description="Here is where you can edit the exercises you've previously created which are referenced throughout the app"
        titleRightSection={
          <Anchor variant="danger" onPress={() => setIsDeleteModalVisible(true)}>
            Delete exercise
          </Anchor>
        }
      >
        <Modal
          animationType="fade"
          transparent={true}
          visible={isDeleteModalVisible}
          onRequestClose={() => setIsDeleteModalVisible(false)}
          statusBarTranslucent
        >
          <View
            sx={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              position: 'relative',
              height: '100%',
            }}
          >
            <Pressable
              onPress={() => setIsDeleteModalVisible(false)}
              sx={{ position: 'absolute', width: '100%', height: '100%', bg: 'rgba(113, 113, 122, 0.75)' }}
            />
            <View
              sx={{
                bg: 'white',
                borderRadius: 'lg',
                padding: 'md',
                my: 'lg',
                alignItems: 'center',
                boxShadow: 'xl',
                width: '100%',
                maxWidth: width - theme.space.lg,
              }}
            >
              <View
                sx={{
                  height: 48,
                  width: 48,
                  bg: 'background-danger',
                  borderRadius: 'full',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ExclamationTriangleIcon sx={{ color: 'icon-danger' }} />
              </View>
              <View sx={{ pt: 'sm' }}>
                <Text variants={['lg', 'normal']} sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                  Delete &quot;{exercise.name}&quot;?
                </Text>
                <Text variants={['sm', 'muted']} sx={{ mt: 'sm', textAlign: 'center', px: 'sm' }}>
                  Are you sure you want to delete this exercise? All of the data attached to this exercise will be
                  deleted forever. This action cannot be undone.
                </Text>
              </View>
              <View sx={{ pt: 'md', width: '100%' }}>
                <Button
                  variant="danger"
                  loading={deleteMutation.isLoading}
                  onPress={() => {
                    deleteMutation.mutate({ id: exercise.id });
                  }}
                >
                  Delete exercise
                </Button>
                <Button variant="tertiary" sx={{ mt: 'sm' }} onPress={() => setIsDeleteModalVisible(false)}>
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <ExerciseEditor
          exercise={exercise}
          error={authError || updateMutation.error?.message}
          isLoading={updateMutation.isLoading}
          onSubmit={async (data) => {
            const {
              data: { session },
              error,
            } = await supabase.auth.getSession();
            if (error) {
              setAuthError(error.message);
            }
            if (session) {
              updateMutation.mutate({ ...data, user: session.user.id });
            }
          }}
        />
      </Layout>
    </SafeAreaView>
  );
};
