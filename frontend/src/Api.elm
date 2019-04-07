module Api exposing (Category, getCategories)

import Http
import Json.Encode as Encode
import Json.Decode as Decode

apiEndpoint =
  "http://localhost:4000?"

query msg body vars decoder =
  let
    encodedVars = Encode.encode 0 (Encode.object vars)
  in
    Http.get
      { url = apiEndpoint ++ "query=" ++ body ++ "&variables=" ++ encodedVars
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

