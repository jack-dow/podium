import React, { useEffect, useRef, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/buttons/Button';
import type { RootStackParamList } from '@/_app';

import { SafeAreaView } from '@/components/layout/SafeAreaView';
import { useTheme } from '@/themes';
import { responsive } from '@/responsive';
import {
  TemplateProvider,
  useAddTemplateSet,
  useTemplateExerciseSets,
  useTemplateId,
  useTemplateName,
  useTemplateSets,
} from '@/providers/FullTemplateProvider';

type Props = NativeStackScreenProps<RootStackParamList, 'Playground'>;

export const PlaygroundScreen = ({ navigation }: Props) => {
  const [test, setTest] = useState();
  const { spacing } = useTheme();
  return (
    <SafeAreaView>
      <View
        style={{
          position: 'relative',
          flex: 1,
          paddingHorizontal: responsive({ base: spacing.md, md: spacing.lg }),
          paddingTop: spacing.md,
          paddingBottom: spacing.xl,
        }}
      >
        <Text>Hello world!</Text>
        {/* <TemplateProvider id={null}>
          <View style={{ marginBottom: 12 }}>
            <Button1 />
            <Button2 />
          </View>
        </TemplateProvider> */}
        {/* <TemplateProvider id={null}>
          <View>
            <Button1 />
            <Button2 />
          </View>
        </TemplateProvider> */}
      </View>
    </SafeAreaView>
  );
};

function Button1() {
  const renderCount = useRef(0);
  const templateSets = useTemplateSets();
  const addSet = useAddTemplateSet();

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Button ONE (1): ${renderCount.current} renders`);
  });

  return (
    <Button onPress={() => addSet('123')} style={{ marginBottom: 12 }}>
      <Button.Text>Template Sets Length: {templateSets.length}</Button.Text>
    </Button>
  );
}
function Button2() {
  const renderCount = useRef(0);
  const test = useTemplateExerciseSets('123');

  useEffect(() => {
    renderCount.current += 1;
    console.log(`Button TWO (2): ${renderCount.current} renders`);
  });
  return (
    <Button>
      <Button.Text>Template Exercise &quot;123&quot; length: {test?.length || 0}</Button.Text>
    </Button>
  );
}
