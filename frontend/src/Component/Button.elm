module Component.Button exposing (regular, link)

import Html exposing (Html, a, button, text)
import Html.Attributes exposing (class, href)

regular slot =
  a [ class "Button" ] [ text slot ]

link path slot =
  a [ class "Button", href path ] [ text slot ]
