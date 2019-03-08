import Browser exposing (sandbox)
import Html exposing (div, text)

import Page.Index as Page

main =
  sandbox { init = 0, update = update, view = view }

update msg model =
  0

view model =
  div []
  [ Page.view
  ]
