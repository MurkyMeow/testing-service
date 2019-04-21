module Api exposing
  ( Category
  , getCategories
  , getQuestions
  , getTests
  , signin
  , signup
  , Answer
  , User
  , Test
  , Question
  )

import Http
import Json.Encode as Encode
import Json.Decode as Decode

apiEndpoint =
  "http://localhost:4000"

get endpoint params decoder msg =
  let
    foo =
      List.foldr (\(key, value) acc -> acc ++ key ++ "=" ++ value ++ "&") "" params
  in
    Http.get
      { url = apiEndpoint ++ endpoint ++ "?" ++ foo
      , expect = Http.expectJson msg decoder
      }

post endpoint body decoder msg =
  let
    encodedBody = Http.jsonBody (Encode.object body)
  in
    Http.post
      { url = apiEndpoint ++ endpoint
      , body = encodedBody
      , expect = Http.expectJson msg decoder
      }

type alias Category =
  { id : Int
  , name : String
  }

getCategories =
  get "/test/categories" []
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
  get "/test/tests"
    [("category_id", String.fromInt categoryId)]
    (Decode.field "tests" (Decode.list
      (Decode.map2 Test
        (Decode.field "id" Decode.int)
        (Decode.field "name" Decode.string)
      )
    ))

type alias Answer =
  { id : Int
  , text : String
  }

type alias Question =
  { id : Int
  , text : String
  , answers : List Answer
  }

getQuestions testId =
  get "/test/questions"
    [ ("test_id", String.fromInt testId) ]
    (Decode.field "questions" (Decode.list
      (Decode.map3 Question
        (Decode.field "id" Decode.int)
        (Decode.field "text" Decode.string)
        (Decode.field "answers" (Decode.list
          (Decode.map2 Answer
            (Decode.field "id" Decode.int)
            (Decode.field "text" Decode.string)
          )
        ))
      )
    ))

type alias User =
  { name : String
  }

signin email password =
  post "/auth/signin"
    [ ("email", Encode.string email)
    , ("password", Encode.string password)
    ]
    (Decode.map User
      (Decode.field "name" Decode.string)
    )

signup name email password =
  post "/auth/signup"
    [ ("name", Encode.string name)
    , ("email", Encode.string email)
    , ("password", Encode.string password)
    ]
    (Decode.field "signup" Decode.string)
