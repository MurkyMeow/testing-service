import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Answer = {
   __typename?: 'Answer',
  id: Scalars['Int'],
  text: Scalars['String'],
  correct: Scalars['Boolean'],
  question: Question,
};

export type AnswerInput = {
  id?: Maybe<Scalars['Int']>,
  text: Scalars['String'],
  correct: Scalars['Boolean'],
};

export type Category = {
   __typename?: 'Category',
  id: Scalars['Int'],
  name: Scalars['String'],
  creator: User,
  tests: Array<Test>,
};

export type Conclusion = {
   __typename?: 'Conclusion',
  id: Scalars['Int'],
  text: Scalars['String'],
  minScore: Scalars['Float'],
  test: Test,
};

export type ConclusionInput = {
  id?: Maybe<Scalars['Float']>,
  text: Scalars['String'],
  minScore: Scalars['Float'],
};

export type EditProfileInput = {
  name: Scalars['String'],
};

export type Mutation = {
   __typename?: 'Mutation',
  changeUserRole: User,
  editProfile: User,
  signout: Scalars['Boolean'],
  signup: User,
  signin: User,
  addCategory: Category,
  editCategory: Category,
  deleteCategory: Scalars['Boolean'],
  addTest: Test,
  editTest: Test,
  createTest: Test,
  setTestConclusions: Test,
  deleteTest: Scalars['Boolean'],
  answer: Scalars['Boolean'],
};


export type MutationChangeUserRoleArgs = {
  role: Role,
  id: Scalars['Int']
};


export type MutationEditProfileArgs = {
  input: EditProfileInput
};


export type MutationSignupArgs = {
  password: Scalars['String'],
  name: Scalars['String'],
  email: Scalars['String']
};


export type MutationSigninArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type MutationAddCategoryArgs = {
  name: Scalars['String']
};


export type MutationEditCategoryArgs = {
  name: Scalars['String'],
  id: Scalars['Int']
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int']
};


export type MutationAddTestArgs = {
  questions: Array<QuestionInput>,
  categoryId: Scalars['Int'],
  name: Scalars['String']
};


export type MutationEditTestArgs = {
  questions: Array<QuestionInput>,
  name: Scalars['String'],
  id: Scalars['Int']
};


export type MutationCreateTestArgs = {
  questions: Array<QuestionInput>,
  categoryId: Scalars['Int'],
  name: Scalars['String']
};


export type MutationSetTestConclusionsArgs = {
  conclusions: Array<ConclusionInput>,
  testId: Scalars['Int']
};


export type MutationDeleteTestArgs = {
  id: Scalars['Int']
};


export type MutationAnswerArgs = {
  answers: Array<QuestionAnswerInput>,
  testId: Scalars['Int']
};

export type Query = {
   __typename?: 'Query',
  self: User,
  getProfile: User,
  getProfilesByRole: Array<User>,
  getCategories: Array<Category>,
  getCategory: Category,
  getTest: Test,
  getResult: Result,
};


export type QueryGetProfileArgs = {
  id: Scalars['Int']
};


export type QueryGetProfilesByRoleArgs = {
  role: Role
};


export type QueryGetCategoryArgs = {
  id: Scalars['Int']
};


export type QueryGetTestArgs = {
  id: Scalars['Int']
};


export type QueryGetResultArgs = {
  testId: Scalars['Int']
};

export type Question = {
   __typename?: 'Question',
  id: Scalars['Int'],
  text: Scalars['String'],
  test: Test,
  answers: Array<Answer>,
};

export type QuestionAnswerInput = {
  questionId: Scalars['Int'],
  answerId: Scalars['Int'],
};

export type QuestionInput = {
  id?: Maybe<Scalars['Int']>,
  text: Scalars['String'],
  answers: Array<AnswerInput>,
};

export type Result = {
   __typename?: 'Result',
  id: Scalars['Int'],
  score: Scalars['Float'],
  conclusion?: Maybe<Scalars['String']>,
  test: Test,
};

export enum Role {
  User = 'user',
  Teacher = 'teacher',
  Admin = 'admin'
}

export type Test = {
   __typename?: 'Test',
  id: Scalars['Int'],
  name: Scalars['String'],
  creator: User,
  category: Category,
  questions: Array<Question>,
  conclusions: Array<Conclusion>,
  results: Array<Result>,
  maxScore: Scalars['Int'],
};

export type User = {
   __typename?: 'User',
  id: Scalars['Int'],
  name: Scalars['String'],
  email: Scalars['String'],
  role: Role,
  tests: Array<Test>,
  categories: Array<Category>,
  results: Array<Result>,
};

export type SignupMutationVariables = {
  email: Scalars['String'],
  name: Scalars['String'],
  password: Scalars['String']
};


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type SigninMutationVariables = {
  email: Scalars['String'],
  password: Scalars['String']
};


export type SigninMutation = (
  { __typename?: 'Mutation' }
  & { signin: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type SelfQueryVariables = {};


export type SelfQuery = (
  { __typename?: 'Query' }
  & { self: (
    { __typename?: 'User' }
    & UserFieldsFragment
  ) }
);

export type SignoutMutationVariables = {};


export type SignoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'signout'>
);

export type UserFieldsFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'email' | 'role'>
  & { tests: Array<(
    { __typename?: 'Test' }
    & Pick<Test, 'id' | 'name'>
  )>, results: Array<(
    { __typename?: 'Result' }
    & Pick<Result, 'id' | 'score'>
    & { test: (
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'name'>
    ) }
  )>, categories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  )> }
);

export type GetCategoriesQueryVariables = {};


export type GetCategoriesQuery = (
  { __typename?: 'Query' }
  & { getCategories: Array<(
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ), tests: Array<(
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'name'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
    )> }
  )> }
);

export type AddCategoryMutationVariables = {
  name: Scalars['String']
};


export type AddCategoryMutation = (
  { __typename?: 'Mutation' }
  & { addCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  ) }
);

export type EditCategoryMutationVariables = {
  id: Scalars['Int'],
  name: Scalars['String']
};


export type EditCategoryMutation = (
  { __typename?: 'Mutation' }
  & { editCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
  ) }
);

export type DeleteCategoryMutationVariables = {
  id: Scalars['Int']
};


export type DeleteCategoryMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteCategory'>
);

export type GetCategoryQueryVariables = {
  id: Scalars['Int']
};


export type GetCategoryQuery = (
  { __typename?: 'Query' }
  & { getCategory: (
    { __typename?: 'Category' }
    & Pick<Category, 'id' | 'name'>
    & { tests: Array<(
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'name' | 'maxScore'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ), questions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'id'>
      )>, results: Array<(
        { __typename?: 'Result' }
        & Pick<Result, 'id' | 'score'>
      )> }
    )> }
  ) }
);

export type DeleteTestMutationVariables = {
  id: Scalars['Int']
};


export type DeleteTestMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteTest'>
);

export type GetTeachersQueryVariables = {};


export type GetTeachersQuery = (
  { __typename?: 'Query' }
  & { getProfilesByRole: Array<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name'>
  )> }
);

export type ChangeUserRoleMutationVariables = {
  id: Scalars['Int'],
  role: Role
};


export type ChangeUserRoleMutation = (
  { __typename?: 'Mutation' }
  & { changeUserRole: (
    { __typename?: 'User' }
    & Pick<User, 'id'>
  ) }
);

export type GetProfileQueryVariables = {
  id: Scalars['Int']
};


export type GetProfileQuery = (
  { __typename?: 'Query' }
  & { getProfile: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email' | 'role'>
    & { tests: Array<(
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'name' | 'maxScore'>
      & { questions: Array<(
        { __typename?: 'Question' }
        & Pick<Question, 'id'>
      )>, results: Array<(
        { __typename?: 'Result' }
        & Pick<Result, 'id' | 'score'>
      )> }
    )>, results: Array<(
      { __typename?: 'Result' }
      & Pick<Result, 'id' | 'score'>
      & { test: (
        { __typename?: 'Test' }
        & Pick<Test, 'id' | 'name' | 'maxScore'>
      ) }
    )> }
  ) }
);

export type EditProfileMutationVariables = {
  input: EditProfileInput
};


export type EditProfileMutation = (
  { __typename?: 'Mutation' }
  & { editProfile: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email' | 'role'>
    & { tests: Array<(
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'name'>
    )> }
  ) }
);

export type GetResultQueryVariables = {
  testId: Scalars['Int']
};


export type GetResultQuery = (
  { __typename?: 'Query' }
  & { getResult: (
    { __typename?: 'Result' }
    & Pick<Result, 'id' | 'score' | 'conclusion'>
    & { test: (
      { __typename?: 'Test' }
      & Pick<Test, 'id' | 'maxScore'>
    ) }
  ) }
);

export type FullTestFragment = (
  { __typename?: 'Test' }
  & Pick<Test, 'id' | 'name'>
  & { questions: Array<(
    { __typename?: 'Question' }
    & Pick<Question, 'id' | 'text'>
    & { answers: Array<(
      { __typename?: 'Answer' }
      & Pick<Answer, 'id' | 'text' | 'correct'>
    )> }
  )>, conclusions: Array<(
    { __typename?: 'Conclusion' }
    & Pick<Conclusion, 'id' | 'text' | 'minScore'>
  )> }
);

export type GetFullTestQueryVariables = {
  id: Scalars['Int']
};


export type GetFullTestQuery = (
  { __typename?: 'Query' }
  & { getTest: (
    { __typename?: 'Test' }
    & FullTestFragment
  ) }
);

export type EditTestMutationVariables = {
  id: Scalars['Int'],
  name: Scalars['String'],
  questions: Array<QuestionInput>
};


export type EditTestMutation = (
  { __typename?: 'Mutation' }
  & { editTest: (
    { __typename?: 'Test' }
    & FullTestFragment
  ) }
);

export type CreateTestMutationVariables = {
  categoryId: Scalars['Int'],
  name: Scalars['String'],
  questions: Array<QuestionInput>
};


export type CreateTestMutation = (
  { __typename?: 'Mutation' }
  & { createTest: (
    { __typename?: 'Test' }
    & FullTestFragment
  ) }
);

export type SetTestConclusionsMutationVariables = {
  testId: Scalars['Int'],
  conclusions: Array<ConclusionInput>
};


export type SetTestConclusionsMutation = (
  { __typename?: 'Mutation' }
  & { setTestConclusions: (
    { __typename?: 'Test' }
    & FullTestFragment
  ) }
);

export type GetTestQueryVariables = {
  id: Scalars['Int']
};


export type GetTestQuery = (
  { __typename?: 'Query' }
  & { getTest: (
    { __typename?: 'Test' }
    & Pick<Test, 'id' | 'name'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'id'>
    ), category: (
      { __typename?: 'Category' }
      & Pick<Category, 'id' | 'name'>
    ), questions: Array<(
      { __typename?: 'Question' }
      & Pick<Question, 'id' | 'text'>
      & { answers: Array<(
        { __typename?: 'Answer' }
        & Pick<Answer, 'id' | 'text'>
      )> }
    )> }
  ) }
);

export type AnswerMutationVariables = {
  testId: Scalars['Int'],
  answers: Array<QuestionAnswerInput>
};


export type AnswerMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'answer'>
);

export const UserFieldsFragmentDoc = gql`
    fragment UserFields on User {
  id
  name
  email
  role
  tests {
    id
    name
  }
  results {
    id
    score
    test {
      id
      name
    }
  }
  categories {
    id
    name
  }
}
    `;
export const FullTestFragmentDoc = gql`
    fragment FullTest on Test {
  id
  name
  questions {
    id
    text
    answers {
      id
      text
      correct
    }
  }
  conclusions {
    id
    text
    minScore
  }
}
    `;
export const SignupDocument = gql`
    mutation Signup($email: String!, $name: String!, $password: String!) {
  signup(email: $email, name: $name, password: $password) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type SignupMutationFn = ApolloReactCommon.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      email: // value for 'email'
 *      name: // value for 'name'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        return ApolloReactHooks.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, baseOptions);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = ApolloReactCommon.MutationResult<SignupMutation>;
export type SignupMutationOptions = ApolloReactCommon.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const SigninDocument = gql`
    mutation Signin($email: String!, $password: String!) {
  signin(email: $email, password: $password) {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;
export type SigninMutationFn = ApolloReactCommon.MutationFunction<SigninMutation, SigninMutationVariables>;

/**
 * __useSigninMutation__
 *
 * To run a mutation, you first call `useSigninMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSigninMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signinMutation, { data, loading, error }] = useSigninMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useSigninMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SigninMutation, SigninMutationVariables>) {
        return ApolloReactHooks.useMutation<SigninMutation, SigninMutationVariables>(SigninDocument, baseOptions);
      }
export type SigninMutationHookResult = ReturnType<typeof useSigninMutation>;
export type SigninMutationResult = ApolloReactCommon.MutationResult<SigninMutation>;
export type SigninMutationOptions = ApolloReactCommon.BaseMutationOptions<SigninMutation, SigninMutationVariables>;
export const SelfDocument = gql`
    query Self {
  self {
    ...UserFields
  }
}
    ${UserFieldsFragmentDoc}`;

/**
 * __useSelfQuery__
 *
 * To run a query within a React component, call `useSelfQuery` and pass it any options that fit your needs.
 * When your component renders, `useSelfQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSelfQuery({
 *   variables: {
 *   },
 * });
 */
export function useSelfQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SelfQuery, SelfQueryVariables>) {
        return ApolloReactHooks.useQuery<SelfQuery, SelfQueryVariables>(SelfDocument, baseOptions);
      }
export function useSelfLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SelfQuery, SelfQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SelfQuery, SelfQueryVariables>(SelfDocument, baseOptions);
        }
export type SelfQueryHookResult = ReturnType<typeof useSelfQuery>;
export type SelfLazyQueryHookResult = ReturnType<typeof useSelfLazyQuery>;
export type SelfQueryResult = ApolloReactCommon.QueryResult<SelfQuery, SelfQueryVariables>;
export const SignoutDocument = gql`
    mutation Signout {
  signout
}
    `;
export type SignoutMutationFn = ApolloReactCommon.MutationFunction<SignoutMutation, SignoutMutationVariables>;

/**
 * __useSignoutMutation__
 *
 * To run a mutation, you first call `useSignoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signoutMutation, { data, loading, error }] = useSignoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useSignoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignoutMutation, SignoutMutationVariables>) {
        return ApolloReactHooks.useMutation<SignoutMutation, SignoutMutationVariables>(SignoutDocument, baseOptions);
      }
export type SignoutMutationHookResult = ReturnType<typeof useSignoutMutation>;
export type SignoutMutationResult = ApolloReactCommon.MutationResult<SignoutMutation>;
export type SignoutMutationOptions = ApolloReactCommon.BaseMutationOptions<SignoutMutation, SignoutMutationVariables>;
export const GetCategoriesDocument = gql`
    query GetCategories {
  getCategories {
    id
    name
    creator {
      id
      name
    }
    tests {
      id
      name
      creator {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetCategoriesQuery__
 *
 * To run a query within a React component, call `useGetCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions);
      }
export function useGetCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoriesQuery, GetCategoriesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, baseOptions);
        }
export type GetCategoriesQueryHookResult = ReturnType<typeof useGetCategoriesQuery>;
export type GetCategoriesLazyQueryHookResult = ReturnType<typeof useGetCategoriesLazyQuery>;
export type GetCategoriesQueryResult = ApolloReactCommon.QueryResult<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const AddCategoryDocument = gql`
    mutation AddCategory($name: String!) {
  addCategory(name: $name) {
    id
    name
  }
}
    `;
export type AddCategoryMutationFn = ApolloReactCommon.MutationFunction<AddCategoryMutation, AddCategoryMutationVariables>;

/**
 * __useAddCategoryMutation__
 *
 * To run a mutation, you first call `useAddCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCategoryMutation, { data, loading, error }] = useAddCategoryMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useAddCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddCategoryMutation, AddCategoryMutationVariables>) {
        return ApolloReactHooks.useMutation<AddCategoryMutation, AddCategoryMutationVariables>(AddCategoryDocument, baseOptions);
      }
export type AddCategoryMutationHookResult = ReturnType<typeof useAddCategoryMutation>;
export type AddCategoryMutationResult = ApolloReactCommon.MutationResult<AddCategoryMutation>;
export type AddCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<AddCategoryMutation, AddCategoryMutationVariables>;
export const EditCategoryDocument = gql`
    mutation EditCategory($id: Int!, $name: String!) {
  editCategory(id: $id, name: $name) {
    id
    name
  }
}
    `;
export type EditCategoryMutationFn = ApolloReactCommon.MutationFunction<EditCategoryMutation, EditCategoryMutationVariables>;

/**
 * __useEditCategoryMutation__
 *
 * To run a mutation, you first call `useEditCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCategoryMutation, { data, loading, error }] = useEditCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditCategoryMutation, EditCategoryMutationVariables>) {
        return ApolloReactHooks.useMutation<EditCategoryMutation, EditCategoryMutationVariables>(EditCategoryDocument, baseOptions);
      }
export type EditCategoryMutationHookResult = ReturnType<typeof useEditCategoryMutation>;
export type EditCategoryMutationResult = ApolloReactCommon.MutationResult<EditCategoryMutation>;
export type EditCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<EditCategoryMutation, EditCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($id: Int!) {
  deleteCategory(id: $id)
}
    `;
export type DeleteCategoryMutationFn = ApolloReactCommon.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, baseOptions);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = ApolloReactCommon.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetCategoryDocument = gql`
    query GetCategory($id: Int!) {
  getCategory(id: $id) {
    id
    name
    tests {
      id
      name
      maxScore
      creator {
        id
        name
      }
      questions {
        id
      }
      results {
        id
        score
      }
    }
  }
}
    `;

/**
 * __useGetCategoryQuery__
 *
 * To run a query within a React component, call `useGetCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCategoryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
        return ApolloReactHooks.useQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, baseOptions);
      }
export function useGetCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCategoryQuery, GetCategoryQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetCategoryQuery, GetCategoryQueryVariables>(GetCategoryDocument, baseOptions);
        }
export type GetCategoryQueryHookResult = ReturnType<typeof useGetCategoryQuery>;
export type GetCategoryLazyQueryHookResult = ReturnType<typeof useGetCategoryLazyQuery>;
export type GetCategoryQueryResult = ApolloReactCommon.QueryResult<GetCategoryQuery, GetCategoryQueryVariables>;
export const DeleteTestDocument = gql`
    mutation DeleteTest($id: Int!) {
  deleteTest(id: $id)
}
    `;
export type DeleteTestMutationFn = ApolloReactCommon.MutationFunction<DeleteTestMutation, DeleteTestMutationVariables>;

/**
 * __useDeleteTestMutation__
 *
 * To run a mutation, you first call `useDeleteTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTestMutation, { data, loading, error }] = useDeleteTestMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteTestMutation, DeleteTestMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteTestMutation, DeleteTestMutationVariables>(DeleteTestDocument, baseOptions);
      }
export type DeleteTestMutationHookResult = ReturnType<typeof useDeleteTestMutation>;
export type DeleteTestMutationResult = ApolloReactCommon.MutationResult<DeleteTestMutation>;
export type DeleteTestMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteTestMutation, DeleteTestMutationVariables>;
export const GetTeachersDocument = gql`
    query GetTeachers {
  getProfilesByRole(role: teacher) {
    id
    name
  }
}
    `;

/**
 * __useGetTeachersQuery__
 *
 * To run a query within a React component, call `useGetTeachersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTeachersQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTeachersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTeachersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTeachersQuery, GetTeachersQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTeachersQuery, GetTeachersQueryVariables>(GetTeachersDocument, baseOptions);
      }
export function useGetTeachersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTeachersQuery, GetTeachersQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTeachersQuery, GetTeachersQueryVariables>(GetTeachersDocument, baseOptions);
        }
export type GetTeachersQueryHookResult = ReturnType<typeof useGetTeachersQuery>;
export type GetTeachersLazyQueryHookResult = ReturnType<typeof useGetTeachersLazyQuery>;
export type GetTeachersQueryResult = ApolloReactCommon.QueryResult<GetTeachersQuery, GetTeachersQueryVariables>;
export const ChangeUserRoleDocument = gql`
    mutation ChangeUserRole($id: Int!, $role: Role!) {
  changeUserRole(id: $id, role: $role) {
    id
  }
}
    `;
export type ChangeUserRoleMutationFn = ApolloReactCommon.MutationFunction<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>;

/**
 * __useChangeUserRoleMutation__
 *
 * To run a mutation, you first call `useChangeUserRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUserRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUserRoleMutation, { data, loading, error }] = useChangeUserRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useChangeUserRoleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>) {
        return ApolloReactHooks.useMutation<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>(ChangeUserRoleDocument, baseOptions);
      }
export type ChangeUserRoleMutationHookResult = ReturnType<typeof useChangeUserRoleMutation>;
export type ChangeUserRoleMutationResult = ApolloReactCommon.MutationResult<ChangeUserRoleMutation>;
export type ChangeUserRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>;
export const GetProfileDocument = gql`
    query GetProfile($id: Int!) {
  getProfile(id: $id) {
    id
    name
    email
    role
    tests {
      id
      name
      maxScore
      questions {
        id
      }
      results {
        id
        score
      }
    }
    results {
      id
      score
      test {
        id
        name
        maxScore
      }
    }
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, baseOptions);
      }
export function useGetProfileLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, baseOptions);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = ApolloReactCommon.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const EditProfileDocument = gql`
    mutation EditProfile($input: EditProfileInput!) {
  editProfile(input: $input) {
    id
    name
    email
    role
    tests {
      id
      name
    }
  }
}
    `;
export type EditProfileMutationFn = ApolloReactCommon.MutationFunction<EditProfileMutation, EditProfileMutationVariables>;

/**
 * __useEditProfileMutation__
 *
 * To run a mutation, you first call `useEditProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editProfileMutation, { data, loading, error }] = useEditProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEditProfileMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditProfileMutation, EditProfileMutationVariables>) {
        return ApolloReactHooks.useMutation<EditProfileMutation, EditProfileMutationVariables>(EditProfileDocument, baseOptions);
      }
export type EditProfileMutationHookResult = ReturnType<typeof useEditProfileMutation>;
export type EditProfileMutationResult = ApolloReactCommon.MutationResult<EditProfileMutation>;
export type EditProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<EditProfileMutation, EditProfileMutationVariables>;
export const GetResultDocument = gql`
    query GetResult($testId: Int!) {
  getResult(testId: $testId) {
    id
    score
    conclusion
    test {
      id
      maxScore
    }
  }
}
    `;

/**
 * __useGetResultQuery__
 *
 * To run a query within a React component, call `useGetResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetResultQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetResultQuery({
 *   variables: {
 *      testId: // value for 'testId'
 *   },
 * });
 */
export function useGetResultQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetResultQuery, GetResultQueryVariables>) {
        return ApolloReactHooks.useQuery<GetResultQuery, GetResultQueryVariables>(GetResultDocument, baseOptions);
      }
export function useGetResultLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetResultQuery, GetResultQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetResultQuery, GetResultQueryVariables>(GetResultDocument, baseOptions);
        }
export type GetResultQueryHookResult = ReturnType<typeof useGetResultQuery>;
export type GetResultLazyQueryHookResult = ReturnType<typeof useGetResultLazyQuery>;
export type GetResultQueryResult = ApolloReactCommon.QueryResult<GetResultQuery, GetResultQueryVariables>;
export const GetFullTestDocument = gql`
    query GetFullTest($id: Int!) {
  getTest(id: $id) {
    ...FullTest
  }
}
    ${FullTestFragmentDoc}`;

/**
 * __useGetFullTestQuery__
 *
 * To run a query within a React component, call `useGetFullTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullTestQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullTestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFullTestQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetFullTestQuery, GetFullTestQueryVariables>) {
        return ApolloReactHooks.useQuery<GetFullTestQuery, GetFullTestQueryVariables>(GetFullTestDocument, baseOptions);
      }
export function useGetFullTestLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFullTestQuery, GetFullTestQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetFullTestQuery, GetFullTestQueryVariables>(GetFullTestDocument, baseOptions);
        }
export type GetFullTestQueryHookResult = ReturnType<typeof useGetFullTestQuery>;
export type GetFullTestLazyQueryHookResult = ReturnType<typeof useGetFullTestLazyQuery>;
export type GetFullTestQueryResult = ApolloReactCommon.QueryResult<GetFullTestQuery, GetFullTestQueryVariables>;
export const EditTestDocument = gql`
    mutation EditTest($id: Int!, $name: String!, $questions: [QuestionInput!]!) {
  editTest(id: $id, name: $name, questions: $questions) {
    ...FullTest
  }
}
    ${FullTestFragmentDoc}`;
export type EditTestMutationFn = ApolloReactCommon.MutationFunction<EditTestMutation, EditTestMutationVariables>;

/**
 * __useEditTestMutation__
 *
 * To run a mutation, you first call `useEditTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editTestMutation, { data, loading, error }] = useEditTestMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *      questions: // value for 'questions'
 *   },
 * });
 */
export function useEditTestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EditTestMutation, EditTestMutationVariables>) {
        return ApolloReactHooks.useMutation<EditTestMutation, EditTestMutationVariables>(EditTestDocument, baseOptions);
      }
export type EditTestMutationHookResult = ReturnType<typeof useEditTestMutation>;
export type EditTestMutationResult = ApolloReactCommon.MutationResult<EditTestMutation>;
export type EditTestMutationOptions = ApolloReactCommon.BaseMutationOptions<EditTestMutation, EditTestMutationVariables>;
export const CreateTestDocument = gql`
    mutation CreateTest($categoryId: Int!, $name: String!, $questions: [QuestionInput!]!) {
  createTest(categoryId: $categoryId, name: $name, questions: $questions) {
    ...FullTest
  }
}
    ${FullTestFragmentDoc}`;
export type CreateTestMutationFn = ApolloReactCommon.MutationFunction<CreateTestMutation, CreateTestMutationVariables>;

/**
 * __useCreateTestMutation__
 *
 * To run a mutation, you first call `useCreateTestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTestMutation, { data, loading, error }] = useCreateTestMutation({
 *   variables: {
 *      categoryId: // value for 'categoryId'
 *      name: // value for 'name'
 *      questions: // value for 'questions'
 *   },
 * });
 */
export function useCreateTestMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTestMutation, CreateTestMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTestMutation, CreateTestMutationVariables>(CreateTestDocument, baseOptions);
      }
export type CreateTestMutationHookResult = ReturnType<typeof useCreateTestMutation>;
export type CreateTestMutationResult = ApolloReactCommon.MutationResult<CreateTestMutation>;
export type CreateTestMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTestMutation, CreateTestMutationVariables>;
export const SetTestConclusionsDocument = gql`
    mutation SetTestConclusions($testId: Int!, $conclusions: [ConclusionInput!]!) {
  setTestConclusions(testId: $testId, conclusions: $conclusions) {
    ...FullTest
  }
}
    ${FullTestFragmentDoc}`;
export type SetTestConclusionsMutationFn = ApolloReactCommon.MutationFunction<SetTestConclusionsMutation, SetTestConclusionsMutationVariables>;

/**
 * __useSetTestConclusionsMutation__
 *
 * To run a mutation, you first call `useSetTestConclusionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTestConclusionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTestConclusionsMutation, { data, loading, error }] = useSetTestConclusionsMutation({
 *   variables: {
 *      testId: // value for 'testId'
 *      conclusions: // value for 'conclusions'
 *   },
 * });
 */
export function useSetTestConclusionsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetTestConclusionsMutation, SetTestConclusionsMutationVariables>) {
        return ApolloReactHooks.useMutation<SetTestConclusionsMutation, SetTestConclusionsMutationVariables>(SetTestConclusionsDocument, baseOptions);
      }
export type SetTestConclusionsMutationHookResult = ReturnType<typeof useSetTestConclusionsMutation>;
export type SetTestConclusionsMutationResult = ApolloReactCommon.MutationResult<SetTestConclusionsMutation>;
export type SetTestConclusionsMutationOptions = ApolloReactCommon.BaseMutationOptions<SetTestConclusionsMutation, SetTestConclusionsMutationVariables>;
export const GetTestDocument = gql`
    query GetTest($id: Int!) {
  getTest(id: $id) {
    id
    name
    creator {
      id
    }
    category {
      id
      name
    }
    questions {
      id
      text
      answers {
        id
        text
      }
    }
  }
}
    `;

/**
 * __useGetTestQuery__
 *
 * To run a query within a React component, call `useGetTestQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTestQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTestQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetTestQuery, GetTestQueryVariables>) {
        return ApolloReactHooks.useQuery<GetTestQuery, GetTestQueryVariables>(GetTestDocument, baseOptions);
      }
export function useGetTestLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetTestQuery, GetTestQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetTestQuery, GetTestQueryVariables>(GetTestDocument, baseOptions);
        }
export type GetTestQueryHookResult = ReturnType<typeof useGetTestQuery>;
export type GetTestLazyQueryHookResult = ReturnType<typeof useGetTestLazyQuery>;
export type GetTestQueryResult = ApolloReactCommon.QueryResult<GetTestQuery, GetTestQueryVariables>;
export const AnswerDocument = gql`
    mutation Answer($testId: Int!, $answers: [QuestionAnswerInput!]!) {
  answer(testId: $testId, answers: $answers)
}
    `;
export type AnswerMutationFn = ApolloReactCommon.MutationFunction<AnswerMutation, AnswerMutationVariables>;

/**
 * __useAnswerMutation__
 *
 * To run a mutation, you first call `useAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [answerMutation, { data, loading, error }] = useAnswerMutation({
 *   variables: {
 *      testId: // value for 'testId'
 *      answers: // value for 'answers'
 *   },
 * });
 */
export function useAnswerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AnswerMutation, AnswerMutationVariables>) {
        return ApolloReactHooks.useMutation<AnswerMutation, AnswerMutationVariables>(AnswerDocument, baseOptions);
      }
export type AnswerMutationHookResult = ReturnType<typeof useAnswerMutation>;
export type AnswerMutationResult = ApolloReactCommon.MutationResult<AnswerMutation>;
export type AnswerMutationOptions = ApolloReactCommon.BaseMutationOptions<AnswerMutation, AnswerMutationVariables>;