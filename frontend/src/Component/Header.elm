module Component.Header exposing (view)

import Html exposing (div, a, text)
import Html.Attributes exposing (class, href)

import Component.Button as Button
import Component.Modal as Modal
import Form.Auth as AuthForm

view =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , div [ class "nav" ]
        [ Button.link "/signin" "Создать аккаунт"
        , Button.regular "Войти"
        ]
    , Modal.view <| AuthForm.view
    ]
