module Form.Auth exposing (view)

import Html exposing (Html, form, input, label, text, div)
import Html.Attributes exposing (class, placeholder, type_, value, required)
import Html.Events exposing (onInput, onSubmit)
import Json.Decode as Decode
import Http
import Browser exposing (element)
import Platform.Cmd as Cmd

type alias Model =
  { email : String
  , password : String
  , message : String
  }

type Msg
  = SetEmail String
  | SetPassword String
  | Submit
  | Response (Result Http.Error String)

submit =
  Http.post
    { url = "http://localhost:3000/api/signin"
    , body = Http.emptyBody
    , expect = Http.expectJson Response (Decode.field "message" Decode.string)
    }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SetEmail email ->
      ({ model | email = email }, Cmd.none)
    SetPassword password ->
      ({ model | password = password }, Cmd.none)
    Submit ->
      (model, submit)
    Response result ->
      case result of
        Ok message ->
          ({ model | message = message }, Cmd.none)
        Err _ ->
          ({ model | message = "ошибка"}, Cmd.none)

view =
  div [ class "_auth" ]
    [ div [ class "header" ] [ text "Логин" ]
    , form [ onSubmit Submit ]
        [ input [ placeholder "Email", onInput SetEmail, required True ] []
        , input [ placeholder "Пароль", onInput SetPassword, required True ] []
        , input [ class "submit", type_ "submit", value "Войти" ] []
        ]
    ]
