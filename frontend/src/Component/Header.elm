module Component.Header exposing (view)

import Component.Button as Button
import Html exposing (div, a, text)
import Html.Attributes exposing (class, href)

view =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , div [ class "nav" ]
        [ Button.regular "Вход"
        , Button.link "/signin" "Регистрация"
        ]
    ]
