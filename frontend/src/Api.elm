module Api exposing
  ( Category
  , getCategories
  , getTests
  , signin
  , signup
  , User
  , Test
  )

import Http
import Json.Encode as Encode
import Json.Decode as Decode

apiEndpoint =
  "http://localhost:4000/graphql"

query body vars decoder msg =
  let
    encodedBody = Encode.object
      [ ("query", Encode.string body)
      , ("variables", Encode.object vars)
      ]
      |> Http.jsonBody
  in
    Http.post
      { url = apiEndpoint
      , body = encodedBody
      , expect = Http.expectJson msg (Decode.field "data" decoder)
      }

type alias Category =
  { id : Int
  , name : String
  }

getCategories =
  query
  """{
    categories {
      id
      name
    }
  }"""
  []
  (Decode.field "categories" (Decode.list
    (Decode.map2 Category
      (Decode.field "id" Decode.int)
      (Decode.field "name" Decode.string)
    )
  ))

type alias Test =
  { id : Int
  , name : String
  }

getTests categoryId =
  query
  """
  query ($category_id: Int!) {
    tests(category_id: $category_id) {
      id
      name
    }
  }
  """
  [ ("category_id", Encode.int categoryId) ]
  (Decode.field "tests" (Decode.list
    (Decode.map2 Test
      (Decode.field "id" Decode.int)
      (Decode.field "name" Decode.string)
    )
  ))

type alias User =
  { name : String
  }

signin email password =
  query
  """
  query ($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      name
    }
  }
  """
  [ ("email", Encode.string email)
  , ("password", Encode.string password)
  ]
  (Decode.field "signin" (Decode.map User
    (Decode.field "name" Decode.string)
  ))

signup name email password =
  query
  """
  query ($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password)
  }
  """
  [ ("name", Encode.string name)
  , ("email", Encode.string email)
  , ("password", Encode.string password)
  ]
  (Decode.field "signup" Decode.string)
