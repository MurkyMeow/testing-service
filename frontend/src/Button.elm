module Button exposing (view)

import Html exposing (a, text)
import Html.Attributes exposing (class)

view attributes slot =
  a (attributes ++ [ class "_button" ]) [ text slot ]
