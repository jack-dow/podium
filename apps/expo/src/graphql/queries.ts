/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getExercise = /* GraphQL */ `
  query GetExercise($id: ID!) {
    getExercise(id: $id) {
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
export const listExercises = /* GraphQL */ `
  query ListExercises(
    $filter: ModelExerciseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExercises(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        instructions
        templateExercises {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTemplate = /* GraphQL */ `
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
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
export const listTemplates = /* GraphQL */ `
  query ListTemplates(
    $filter: ModelTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getTemplateExercise = /* GraphQL */ `
  query GetTemplateExercise($id: ID!) {
    getTemplateExercise(id: $id) {
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
export const listTemplateExercises = /* GraphQL */ `
  query ListTemplateExercises(
    $filter: ModelTemplateExerciseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateExercises(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTemplateSet = /* GraphQL */ `
  query GetTemplateSet($id: ID!) {
    getTemplateSet(id: $id) {
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
export const listTemplateSets = /* GraphQL */ `
  query ListTemplateSets(
    $filter: ModelTemplateSetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemplateSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        position
        template {
          id
          name
          createdAt
          updatedAt
        }
        templateExercise {
          id
          notes
          position
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
      nextToken
    }
  }
`;
