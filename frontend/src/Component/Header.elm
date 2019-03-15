module Component.Header exposing (view)

import Html exposing (div, a, text)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onClick)

import Component.Button as Button
import Component.Modal as Modal
import Form.Auth as AuthForm

type alias Model =
  { signupOpen : Bool
  , signinOpen : Bool
  }

type Modal
  = Signin
  | Signup

type Msg
  = SetOpenState Modal Bool

update model msg =
  case msg of
    SetOpenState modal state ->
      case modal of
        Signin ->
          { model | signinOpen = state }
        Signup ->
          { model | signupOpen = state }

view model =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , div [ class "nav" ]
        [ Button.view [ onClick (SetOpenState Signup True) ] "Создать аккаунт"
        , Button.view [ onClick (SetOpenState Signin True) ] "Войти"
        ]
    , Modal.view model.signinOpen (AuthForm.view model) -- TODO: fix the error
    ]
