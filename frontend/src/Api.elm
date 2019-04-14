module Api exposing
  ( Category
  , getCategories
  , signin
  , signup
  , User
  , AuthType(..)
  )

import Http
import Json.Encode as Encode
import Json.Decode as Decode

apiEndpoint =
  "http://localhost:4000"

query msg body vars decoder =
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

getCategories msg =
  query msg
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

type AuthType
  = Signup
  | Signin

type alias User =
  { name : String
  }

authorize authType body decoder email password msg =
  query msg
  (String.replace "#body" body """
    query ($email: String!, $password: String!) {
      #body
    }
  """)
  [("email", Encode.string email), ("password", Encode.string password)]
  decoder

signin =
  authorize Signin
  """
  signin(email: $email, password: $password) {
    name
  }
  """
  (Decode.field "signin" (Decode.map User
    (Decode.field "name" Decode.string)
  ))

signup =
  authorize Signup
  "signin(email: $email, password: $password)"
  (Decode.field "signup" Decode.string)
