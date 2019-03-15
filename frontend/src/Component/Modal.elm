module Component.Modal exposing(view)

import Html exposing (div, text)
import Html.Attributes exposing (class)

view open modal =
  if open then
    div [ class "_modal" ] [ modal ]
  else text ""
