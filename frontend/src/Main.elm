import Browser exposing (sandbox)
import Html exposing (div, text)

main =
  sandbox { init = 0, update = update, view = view }

update msg model =
  0

view model =
  div []
  [ text "Hello world"
  ]
