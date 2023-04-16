import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import clsx from "clsx";

import { Anchor, Layout, Loader, SafeAreaView, Text } from "~/ui";
import { useExercises } from "~/api";

const Exercises = () => {
  const router = useRouter();
  const { data: exercises, isLoading } = useExercises();

  return (
    <SafeAreaView>
      <Layout>
        <Layout.Header>
          <Layout.BackButton />
          <View className="flex-row items-center justify-between">
            <Layout.Title>Exercises</Layout.Title>
            <Anchor onPress={() => router.push("/exercise/new")}>New exercise</Anchor>
          </View>
          <Layout.Description>
            Here you can manage the exercises that are referenced in your plans and workouts
          </Layout.Description>
        </Layout.Header>
        <Layout.Content>
          {isLoading ? (
            <View className="h-full w-full flex-1 items-center justify-center">
              <Loader />
            </View>
          ) : (
            <ScrollView className="my-base px-base">
              {exercises?.map((exercise, index) => {
                const isFirst = index === 0;
                const isLast = index === exercises.length - 1;
                return (
                  <View
                    key={exercise.id}
                    className={clsx(
                      "border-2 border-primary-normal p-sm",
                      isFirst ? "rounded-t-md" : "",
                      isLast ? "rounded-b-md" : "border-b-0",
                    )}
                  >
                    <View className="p-sm sm:px-lg">
                      <View className="flex-row items-center justify-between">
                        <Text weight="medium" className="truncate text-base capitalize text-primary-normal">
                          {exercise.name}
                        </Text>
                        <Anchor onPress={() => router.push(`/exercise/${exercise.id}`)}>Edit</Anchor>
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

export default Exercises;
