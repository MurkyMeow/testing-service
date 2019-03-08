import Browser exposing (sandbox)
import Html exposing (div, text)

import Page.Index as Page
import Component.Header as Header

main =
  sandbox { init = 0, update = update, view = view }

update msg model =
  0

view model =
  div []
  [ Header.view
  , Page.view
  ]
