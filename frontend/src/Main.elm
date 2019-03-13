import Browser exposing (element)
import Html exposing (Html, div, text)
import Html.Attributes
import Platform.Cmd as Cmd
import Tuple

import Page.Index as Page
import Component.Header as Header
import Form.Auth as AuthForm

type alias Model =
  { loginForm : AuthForm.Model
  }

type Msg
  = LoginForm AuthForm.Msg

init : () -> (Model, Cmd Msg)
init _ =
  ({ loginForm = AuthForm.Model "" "" "" }, Cmd.none)

main =
  element { init = init, update = update, view = view, subscriptions = \_ -> Sub.none }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    LoginForm formMsg ->
      let
        upd = AuthForm.update formMsg model.loginForm
      in
        (Model <| Tuple.first upd, Cmd.map LoginForm <| Tuple.second upd)

view : Model -> Html Msg
view model =
  div []
  [ Html.map LoginForm (Header.view model.loginForm)
  , Page.view
  ]
