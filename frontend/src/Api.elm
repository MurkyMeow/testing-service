module Api exposing (Category, getCategories)

import Http
import Json.Encode as Encode
import Json.Decode as Decode

apiEndpoint =
  "http://localhost:4000?query="

query msg decoder body =
  let
    encodedBody = Encode.object
      [ ("query", Encode.string body)
      ]
      |> Http.jsonBody
  in
    Http.get
      { url = apiEndpoint ++ body
      , expect = Http.expectJson msg (Decode.field "data" decoder)
      }

type alias Category =
  { id : Int
  , name : String
  }

categoriesDecoder =
  Decode.field "categories" (Decode.list
    (Decode.map2 Category
      (Decode.field "id" Decode.int)
      (Decode.field "name" Decode.string)
    )
  )

getCategories msg =
  query msg categoriesDecoder """{
    categories {
      id
      name
    }
  }"""
