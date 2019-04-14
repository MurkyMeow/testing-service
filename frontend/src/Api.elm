module Api exposing (Category, getCategories, authorize, AuthType(..))

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

authorize authType email password msg =
  let
    queryName =
      case authType of
        Signup ->
          "signup"
        Signin ->
          "signin"
  in
    query msg
    (String.replace "#type" queryName """
      query ($email: String!, $password: String!) {
        #type(email: $email, password: $password)
      }
    """)
    [("email", Encode.string email), ("password", Encode.string password)]
    (Decode.field "signup" Decode.string)
