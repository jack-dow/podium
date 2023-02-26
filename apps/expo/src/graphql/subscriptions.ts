/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateExercise = /* GraphQL */ `
  subscription OnCreateExercise($filter: ModelSubscriptionExerciseFilterInput) {
    onCreateExercise(filter: $filter) {
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
export const onUpdateExercise = /* GraphQL */ `
  subscription OnUpdateExercise($filter: ModelSubscriptionExerciseFilterInput) {
    onUpdateExercise(filter: $filter) {
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
export const onDeleteExercise = /* GraphQL */ `
  subscription OnDeleteExercise($filter: ModelSubscriptionExerciseFilterInput) {
    onDeleteExercise(filter: $filter) {
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
export const onCreateTemplate = /* GraphQL */ `
  subscription OnCreateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
    onCreateTemplate(filter: $filter) {
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
export const onUpdateTemplate = /* GraphQL */ `
  subscription OnUpdateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
    onUpdateTemplate(filter: $filter) {
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
export const onDeleteTemplate = /* GraphQL */ `
  subscription OnDeleteTemplate($filter: ModelSubscriptionTemplateFilterInput) {
    onDeleteTemplate(filter: $filter) {
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
export const onCreateTemplateExercise = /* GraphQL */ `
  subscription OnCreateTemplateExercise(
    $filter: ModelSubscriptionTemplateExerciseFilterInput
  ) {
    onCreateTemplateExercise(filter: $filter) {
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
export const onUpdateTemplateExercise = /* GraphQL */ `
  subscription OnUpdateTemplateExercise(
    $filter: ModelSubscriptionTemplateExerciseFilterInput
  ) {
    onUpdateTemplateExercise(filter: $filter) {
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
export const onDeleteTemplateExercise = /* GraphQL */ `
  subscription OnDeleteTemplateExercise(
    $filter: ModelSubscriptionTemplateExerciseFilterInput
  ) {
    onDeleteTemplateExercise(filter: $filter) {
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
export const onCreateTemplateSet = /* GraphQL */ `
  subscription OnCreateTemplateSet(
    $filter: ModelSubscriptionTemplateSetFilterInput
  ) {
    onCreateTemplateSet(filter: $filter) {
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
export const onUpdateTemplateSet = /* GraphQL */ `
  subscription OnUpdateTemplateSet(
    $filter: ModelSubscriptionTemplateSetFilterInput
  ) {
    onUpdateTemplateSet(filter: $filter) {
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
export const onDeleteTemplateSet = /* GraphQL */ `
  subscription OnDeleteTemplateSet(
    $filter: ModelSubscriptionTemplateSetFilterInput
  ) {
    onDeleteTemplateSet(filter: $filter) {
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
