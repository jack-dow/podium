/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createExercise = /* GraphQL */ `
  mutation CreateExercise(
    $input: CreateExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    createExercise(input: $input, condition: $condition) {
      id
      name
      instructions
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateExercise = /* GraphQL */ `
  mutation UpdateExercise(
    $input: UpdateExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    updateExercise(input: $input, condition: $condition) {
      id
      name
      instructions
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteExercise = /* GraphQL */ `
  mutation DeleteExercise(
    $input: DeleteExerciseInput!
    $condition: ModelExerciseConditionInput
  ) {
    deleteExercise(input: $input, condition: $condition) {
      id
      name
      instructions
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTemplate = /* GraphQL */ `
  mutation CreateTemplate(
    $input: CreateTemplateInput!
    $condition: ModelTemplateConditionInput
  ) {
    createTemplate(input: $input, condition: $condition) {
      id
      name
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateTemplate = /* GraphQL */ `
  mutation UpdateTemplate(
    $input: UpdateTemplateInput!
    $condition: ModelTemplateConditionInput
  ) {
    updateTemplate(input: $input, condition: $condition) {
      id
      name
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteTemplate = /* GraphQL */ `
  mutation DeleteTemplate(
    $input: DeleteTemplateInput!
    $condition: ModelTemplateConditionInput
  ) {
    deleteTemplate(input: $input, condition: $condition) {
      id
      name
      templateExercises {
        items {
          id
          notes
          position
          createdAt
          updatedAt
          exerciseTemplateExercisesId
          templateTemplateExercisesId
        }
        nextToken
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTemplateExercise = /* GraphQL */ `
  mutation CreateTemplateExercise(
    $input: CreateTemplateExerciseInput!
    $condition: ModelTemplateExerciseConditionInput
  ) {
    createTemplateExercise(input: $input, condition: $condition) {
      id
      notes
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      exercise {
        id
        name
        instructions
        templateExercises {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
      exerciseTemplateExercisesId
      templateTemplateExercisesId
    }
  }
`;
export const updateTemplateExercise = /* GraphQL */ `
  mutation UpdateTemplateExercise(
    $input: UpdateTemplateExerciseInput!
    $condition: ModelTemplateExerciseConditionInput
  ) {
    updateTemplateExercise(input: $input, condition: $condition) {
      id
      notes
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      exercise {
        id
        name
        instructions
        templateExercises {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
      exerciseTemplateExercisesId
      templateTemplateExercisesId
    }
  }
`;
export const deleteTemplateExercise = /* GraphQL */ `
  mutation DeleteTemplateExercise(
    $input: DeleteTemplateExerciseInput!
    $condition: ModelTemplateExerciseConditionInput
  ) {
    deleteTemplateExercise(input: $input, condition: $condition) {
      id
      notes
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      exercise {
        id
        name
        instructions
        templateExercises {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateSets {
        items {
          id
          position
          createdAt
          updatedAt
          templateTemplateSetsId
          templateExerciseTemplateSetsId
        }
        nextToken
      }
      createdAt
      updatedAt
      exerciseTemplateExercisesId
      templateTemplateExercisesId
    }
  }
`;
export const createTemplateSet = /* GraphQL */ `
  mutation CreateTemplateSet(
    $input: CreateTemplateSetInput!
    $condition: ModelTemplateSetConditionInput
  ) {
    createTemplateSet(input: $input, condition: $condition) {
      id
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateExercise {
        id
        notes
        position
        template {
          id
          name
          createdAt
          updatedAt
        }
        exercise {
          id
          name
          instructions
          createdAt
          updatedAt
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
        exerciseTemplateExercisesId
        templateTemplateExercisesId
      }
      createdAt
      updatedAt
      templateTemplateSetsId
      templateExerciseTemplateSetsId
    }
  }
`;
export const updateTemplateSet = /* GraphQL */ `
  mutation UpdateTemplateSet(
    $input: UpdateTemplateSetInput!
    $condition: ModelTemplateSetConditionInput
  ) {
    updateTemplateSet(input: $input, condition: $condition) {
      id
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateExercise {
        id
        notes
        position
        template {
          id
          name
          createdAt
          updatedAt
        }
        exercise {
          id
          name
          instructions
          createdAt
          updatedAt
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
        exerciseTemplateExercisesId
        templateTemplateExercisesId
      }
      createdAt
      updatedAt
      templateTemplateSetsId
      templateExerciseTemplateSetsId
    }
  }
`;
export const deleteTemplateSet = /* GraphQL */ `
  mutation DeleteTemplateSet(
    $input: DeleteTemplateSetInput!
    $condition: ModelTemplateSetConditionInput
  ) {
    deleteTemplateSet(input: $input, condition: $condition) {
      id
      position
      template {
        id
        name
        templateExercises {
          nextToken
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
      }
      templateExercise {
        id
        notes
        position
        template {
          id
          name
          createdAt
          updatedAt
        }
        exercise {
          id
          name
          instructions
          createdAt
          updatedAt
        }
        templateSets {
          nextToken
        }
        createdAt
        updatedAt
        exerciseTemplateExercisesId
        templateTemplateExercisesId
      }
      createdAt
      updatedAt
      templateTemplateSetsId
      templateExerciseTemplateSetsId
    }
  }
`;
