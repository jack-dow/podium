/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateExerciseInput = {
  id?: string | null,
  name: string,
  instructions?: string | null,
};

export type ModelExerciseConditionInput = {
  name?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelExerciseConditionInput | null > | null,
  or?: Array< ModelExerciseConditionInput | null > | null,
  not?: ModelExerciseConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type Exercise = {
  __typename: "Exercise",
  id: string,
  name: string,
  instructions?: string | null,
  templateExercises?: ModelTemplateExerciseConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTemplateExerciseConnection = {
  __typename: "ModelTemplateExerciseConnection",
  items:  Array<TemplateExercise | null >,
  nextToken?: string | null,
};

export type TemplateExercise = {
  __typename: "TemplateExercise",
  id: string,
  notes?: string | null,
  position: number,
  template?: Template | null,
  exercise?: Exercise | null,
  templateSets?: ModelTemplateSetConnection | null,
  createdAt: string,
  updatedAt: string,
  exerciseTemplateExercisesId?: string | null,
  templateTemplateExercisesId?: string | null,
};

export type Template = {
  __typename: "Template",
  id: string,
  name: string,
  templateExercises?: ModelTemplateExerciseConnection | null,
  templateSets?: ModelTemplateSetConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTemplateSetConnection = {
  __typename: "ModelTemplateSetConnection",
  items:  Array<TemplateSet | null >,
  nextToken?: string | null,
};

export type TemplateSet = {
  __typename: "TemplateSet",
  id: string,
  position: number,
  template?: Template | null,
  templateExercise?: TemplateExercise | null,
  createdAt: string,
  updatedAt: string,
  templateTemplateSetsId?: string | null,
  templateExerciseTemplateSetsId?: string | null,
};

export type UpdateExerciseInput = {
  id: string,
  name?: string | null,
  instructions?: string | null,
};

export type DeleteExerciseInput = {
  id: string,
};

export type CreateTemplateInput = {
  id?: string | null,
  name: string,
};

export type ModelTemplateConditionInput = {
  name?: ModelStringInput | null,
  and?: Array< ModelTemplateConditionInput | null > | null,
  or?: Array< ModelTemplateConditionInput | null > | null,
  not?: ModelTemplateConditionInput | null,
};

export type UpdateTemplateInput = {
  id: string,
  name?: string | null,
};

export type DeleteTemplateInput = {
  id: string,
};

export type CreateTemplateExerciseInput = {
  id?: string | null,
  notes?: string | null,
  position: number,
  exerciseTemplateExercisesId?: string | null,
  templateTemplateExercisesId?: string | null,
};

export type ModelTemplateExerciseConditionInput = {
  notes?: ModelStringInput | null,
  position?: ModelIntInput | null,
  and?: Array< ModelTemplateExerciseConditionInput | null > | null,
  or?: Array< ModelTemplateExerciseConditionInput | null > | null,
  not?: ModelTemplateExerciseConditionInput | null,
  exerciseTemplateExercisesId?: ModelIDInput | null,
  templateTemplateExercisesId?: ModelIDInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateTemplateExerciseInput = {
  id: string,
  notes?: string | null,
  position?: number | null,
  exerciseTemplateExercisesId?: string | null,
  templateTemplateExercisesId?: string | null,
};

export type DeleteTemplateExerciseInput = {
  id: string,
};

export type CreateTemplateSetInput = {
  id?: string | null,
  position: number,
  templateTemplateSetsId?: string | null,
  templateExerciseTemplateSetsId?: string | null,
};

export type ModelTemplateSetConditionInput = {
  position?: ModelIntInput | null,
  and?: Array< ModelTemplateSetConditionInput | null > | null,
  or?: Array< ModelTemplateSetConditionInput | null > | null,
  not?: ModelTemplateSetConditionInput | null,
  templateTemplateSetsId?: ModelIDInput | null,
  templateExerciseTemplateSetsId?: ModelIDInput | null,
};

export type UpdateTemplateSetInput = {
  id: string,
  position?: number | null,
  templateTemplateSetsId?: string | null,
  templateExerciseTemplateSetsId?: string | null,
};

export type DeleteTemplateSetInput = {
  id: string,
};

export type ModelExerciseFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  and?: Array< ModelExerciseFilterInput | null > | null,
  or?: Array< ModelExerciseFilterInput | null > | null,
  not?: ModelExerciseFilterInput | null,
};

export type ModelExerciseConnection = {
  __typename: "ModelExerciseConnection",
  items:  Array<Exercise | null >,
  nextToken?: string | null,
};

export type ModelTemplateFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  and?: Array< ModelTemplateFilterInput | null > | null,
  or?: Array< ModelTemplateFilterInput | null > | null,
  not?: ModelTemplateFilterInput | null,
};

export type ModelTemplateConnection = {
  __typename: "ModelTemplateConnection",
  items:  Array<Template | null >,
  nextToken?: string | null,
};

export type ModelTemplateExerciseFilterInput = {
  id?: ModelIDInput | null,
  notes?: ModelStringInput | null,
  position?: ModelIntInput | null,
  and?: Array< ModelTemplateExerciseFilterInput | null > | null,
  or?: Array< ModelTemplateExerciseFilterInput | null > | null,
  not?: ModelTemplateExerciseFilterInput | null,
  exerciseTemplateExercisesId?: ModelIDInput | null,
  templateTemplateExercisesId?: ModelIDInput | null,
};

export type ModelTemplateSetFilterInput = {
  id?: ModelIDInput | null,
  position?: ModelIntInput | null,
  and?: Array< ModelTemplateSetFilterInput | null > | null,
  or?: Array< ModelTemplateSetFilterInput | null > | null,
  not?: ModelTemplateSetFilterInput | null,
  templateTemplateSetsId?: ModelIDInput | null,
  templateExerciseTemplateSetsId?: ModelIDInput | null,
};

export type ModelSubscriptionExerciseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  instructions?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionExerciseFilterInput | null > | null,
  or?: Array< ModelSubscriptionExerciseFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionTemplateFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTemplateFilterInput | null > | null,
  or?: Array< ModelSubscriptionTemplateFilterInput | null > | null,
};

export type ModelSubscriptionTemplateExerciseFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  notes?: ModelSubscriptionStringInput | null,
  position?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionTemplateExerciseFilterInput | null > | null,
  or?: Array< ModelSubscriptionTemplateExerciseFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTemplateSetFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  position?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionTemplateSetFilterInput | null > | null,
  or?: Array< ModelSubscriptionTemplateSetFilterInput | null > | null,
};

export type CreateExerciseMutationVariables = {
  input: CreateExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type CreateExerciseMutation = {
  createExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateExerciseMutationVariables = {
  input: UpdateExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type UpdateExerciseMutation = {
  updateExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteExerciseMutationVariables = {
  input: DeleteExerciseInput,
  condition?: ModelExerciseConditionInput | null,
};

export type DeleteExerciseMutation = {
  deleteExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTemplateMutationVariables = {
  input: CreateTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type CreateTemplateMutation = {
  createTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTemplateMutationVariables = {
  input: UpdateTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type UpdateTemplateMutation = {
  updateTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTemplateMutationVariables = {
  input: DeleteTemplateInput,
  condition?: ModelTemplateConditionInput | null,
};

export type DeleteTemplateMutation = {
  deleteTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTemplateExerciseMutationVariables = {
  input: CreateTemplateExerciseInput,
  condition?: ModelTemplateExerciseConditionInput | null,
};

export type CreateTemplateExerciseMutation = {
  createTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type UpdateTemplateExerciseMutationVariables = {
  input: UpdateTemplateExerciseInput,
  condition?: ModelTemplateExerciseConditionInput | null,
};

export type UpdateTemplateExerciseMutation = {
  updateTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type DeleteTemplateExerciseMutationVariables = {
  input: DeleteTemplateExerciseInput,
  condition?: ModelTemplateExerciseConditionInput | null,
};

export type DeleteTemplateExerciseMutation = {
  deleteTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type CreateTemplateSetMutationVariables = {
  input: CreateTemplateSetInput,
  condition?: ModelTemplateSetConditionInput | null,
};

export type CreateTemplateSetMutation = {
  createTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type UpdateTemplateSetMutationVariables = {
  input: UpdateTemplateSetInput,
  condition?: ModelTemplateSetConditionInput | null,
};

export type UpdateTemplateSetMutation = {
  updateTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type DeleteTemplateSetMutationVariables = {
  input: DeleteTemplateSetInput,
  condition?: ModelTemplateSetConditionInput | null,
};

export type DeleteTemplateSetMutation = {
  deleteTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type GetExerciseQueryVariables = {
  id: string,
};

export type GetExerciseQuery = {
  getExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListExercisesQueryVariables = {
  filter?: ModelExerciseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListExercisesQuery = {
  listExercises?:  {
    __typename: "ModelExerciseConnection",
    items:  Array< {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTemplateQueryVariables = {
  id: string,
};

export type GetTemplateQuery = {
  getTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTemplatesQueryVariables = {
  filter?: ModelTemplateFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTemplatesQuery = {
  listTemplates?:  {
    __typename: "ModelTemplateConnection",
    items:  Array< {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTemplateExerciseQueryVariables = {
  id: string,
};

export type GetTemplateExerciseQuery = {
  getTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type ListTemplateExercisesQueryVariables = {
  filter?: ModelTemplateExerciseFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTemplateExercisesQuery = {
  listTemplateExercises?:  {
    __typename: "ModelTemplateExerciseConnection",
    items:  Array< {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTemplateSetQueryVariables = {
  id: string,
};

export type GetTemplateSetQuery = {
  getTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type ListTemplateSetsQueryVariables = {
  filter?: ModelTemplateSetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTemplateSetsQuery = {
  listTemplateSets?:  {
    __typename: "ModelTemplateSetConnection",
    items:  Array< {
      __typename: "TemplateSet",
      id: string,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateExercise?:  {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      templateTemplateSetsId?: string | null,
      templateExerciseTemplateSetsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
};

export type OnCreateExerciseSubscription = {
  onCreateExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
};

export type OnUpdateExerciseSubscription = {
  onUpdateExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionExerciseFilterInput | null,
};

export type OnDeleteExerciseSubscription = {
  onDeleteExercise?:  {
    __typename: "Exercise",
    id: string,
    name: string,
    instructions?: string | null,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnCreateTemplateSubscription = {
  onCreateTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnUpdateTemplateSubscription = {
  onUpdateTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTemplateSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateFilterInput | null,
};

export type OnDeleteTemplateSubscription = {
  onDeleteTemplate?:  {
    __typename: "Template",
    id: string,
    name: string,
    templateExercises?:  {
      __typename: "ModelTemplateExerciseConnection",
      items:  Array< {
        __typename: "TemplateExercise",
        id: string,
        notes?: string | null,
        position: number,
        createdAt: string,
        updatedAt: string,
        exerciseTemplateExercisesId?: string | null,
        templateTemplateExercisesId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTemplateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateExerciseFilterInput | null,
};

export type OnCreateTemplateExerciseSubscription = {
  onCreateTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type OnUpdateTemplateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateExerciseFilterInput | null,
};

export type OnUpdateTemplateExerciseSubscription = {
  onUpdateTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type OnDeleteTemplateExerciseSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateExerciseFilterInput | null,
};

export type OnDeleteTemplateExerciseSubscription = {
  onDeleteTemplateExercise?:  {
    __typename: "TemplateExercise",
    id: string,
    notes?: string | null,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    exercise?:  {
      __typename: "Exercise",
      id: string,
      name: string,
      instructions?: string | null,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateSets?:  {
      __typename: "ModelTemplateSetConnection",
      items:  Array< {
        __typename: "TemplateSet",
        id: string,
        position: number,
        createdAt: string,
        updatedAt: string,
        templateTemplateSetsId?: string | null,
        templateExerciseTemplateSetsId?: string | null,
      } | null >,
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    exerciseTemplateExercisesId?: string | null,
    templateTemplateExercisesId?: string | null,
  } | null,
};

export type OnCreateTemplateSetSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateSetFilterInput | null,
};

export type OnCreateTemplateSetSubscription = {
  onCreateTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type OnUpdateTemplateSetSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateSetFilterInput | null,
};

export type OnUpdateTemplateSetSubscription = {
  onUpdateTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};

export type OnDeleteTemplateSetSubscriptionVariables = {
  filter?: ModelSubscriptionTemplateSetFilterInput | null,
};

export type OnDeleteTemplateSetSubscription = {
  onDeleteTemplateSet?:  {
    __typename: "TemplateSet",
    id: string,
    position: number,
    template?:  {
      __typename: "Template",
      id: string,
      name: string,
      templateExercises?:  {
        __typename: "ModelTemplateExerciseConnection",
        nextToken?: string | null,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    templateExercise?:  {
      __typename: "TemplateExercise",
      id: string,
      notes?: string | null,
      position: number,
      template?:  {
        __typename: "Template",
        id: string,
        name: string,
        createdAt: string,
        updatedAt: string,
      } | null,
      exercise?:  {
        __typename: "Exercise",
        id: string,
        name: string,
        instructions?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null,
      templateSets?:  {
        __typename: "ModelTemplateSetConnection",
        nextToken?: string | null,
      } | null,
      createdAt: string,
      updatedAt: string,
      exerciseTemplateExercisesId?: string | null,
      templateTemplateExercisesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    templateTemplateSetsId?: string | null,
    templateExerciseTemplateSetsId?: string | null,
  } | null,
};
