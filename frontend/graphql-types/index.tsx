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

export type Mutation = {
   __typename?: 'Mutation',
  signup: User,
  addCategory: Category,
  editCategory: Category,
  deleteCategory: Scalars['Boolean'],
  addTest: Test,
  editTest: Test,
  deleteTest: Scalars['Boolean'],
};


export type MutationSignupArgs = {
  password: Scalars['String'],
  name: Scalars['String'],
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


export type MutationDeleteTestArgs = {
  id: Scalars['Int']
};

export type Query = {
   __typename?: 'Query',
  self: User,
  signout: Scalars['Boolean'],
  signin: User,
  getCategories: Array<Category>,
  getCategory: Category,
  getTest: Test,
};


export type QuerySigninArgs = {
  password: Scalars['String'],
  email: Scalars['String']
};


export type QueryGetCategoryArgs = {
  id: Scalars['Int']
};


export type QueryGetTestArgs = {
  id: Scalars['Int']
};

export type Question = {
   __typename?: 'Question',
  id: Scalars['Int'],
  text: Scalars['String'],
  test: Test,
  answers: Array<Answer>,
};

export type QuestionInput = {
  id?: Maybe<Scalars['Int']>,
  text: Scalars['String'],
  answers: Array<AnswerInput>,
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
};

export type User = {
   __typename?: 'User',
  id: Scalars['Int'],
  name: Scalars['String'],
  email: Scalars['String'],
  role: Role,
};

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
      & Pick<Test, 'id' | 'name'>
      & { creator: (
        { __typename?: 'User' }
        & Pick<User, 'id' | 'name'>
      ) }
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
      creator {
        id
        name
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