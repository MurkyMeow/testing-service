module Form.Auth exposing (view)

import Html exposing (Html, form, input, label, text, div)
import Html.Attributes exposing (class, placeholder, type_, value)

view : Bool -> Html msg
view signup =
  div [ class "_auth" ]
    [ div [ class "header" ] [ text "Логин" ]
    , form []
      [ input [ placeholder "Email" ] []
      , input [ placeholder "Пароль" ] []
      , input [ class "submit", type_ "submit", value "Войти" ] []
      ]
    ]
