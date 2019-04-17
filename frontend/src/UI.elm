module UI exposing (modal, button)

import Html exposing (a, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, stopPropagationOn)
import Json.Decode as Decode

alwaysStop : msg -> ( msg, Bool )
alwaysStop msg =
  ( msg, True )

modal open setOpen slot =
  if open then
    div [ class "_modal", onClick (setOpen False) ]
      [ div [ stopPropagationOn "click" (Decode.succeed (setOpen True) |> Decode.map alwaysStop) ] [ slot ]
      ]
  else
    text ""

button attributes slot =
  a (attributes ++ [ class "_button" ]) [ text slot ]
