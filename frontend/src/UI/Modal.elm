module UI.Modal exposing(view)

import Html exposing (div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, stopPropagationOn)
import Json.Decode as Decode

view open setOpen slot =
  if open then
    div [ class "_modal", onClick (setOpen False) ]
      [ div [ stopPropagationOn "click" (Decode.succeed (setOpen True) |> Decode.map alwaysStop) ] [ slot ]
      ]
  else
    text ""

alwaysStop : msg -> ( msg, Bool )
alwaysStop msg =
  ( msg, True )
