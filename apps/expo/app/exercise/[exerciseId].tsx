import { useSearchParams } from "expo-router";

import { ExerciseEditor } from "~/features/ExerciseEditor";

const UpdateExercise = () => {
  const { exerciseId } = useSearchParams();
  return <ExerciseEditor exerciseId={exerciseId} />;
};

export default UpdateExercise;
