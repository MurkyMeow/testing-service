module Form.Auth exposing (Model, Msg(..), view, submit, update)

import Html exposing (Html, form, input, label, text, div)
import Html.Attributes exposing (class, placeholder, type_, value, required)
import Html.Events exposing (onInput, onSubmit)
import Json.Decode as Decode
import Json.Encode as Encode
import Http
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
  let
    body = Encode.object
      [ ("query", Encode.string "hello")
      ]
      |> Http.jsonBody
  in
    Http.post
      { url = "http://localhost:3000/api?query={hello}"
      , body = body
      , expect = Http.expectJson Response (Decode.field "data" (Decode.field "hello" Decode.string))
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
        Err err ->
          ({ model | message = "Ошибка" }, Cmd.none)

view : Model -> Html Msg
view model =
  div [ class "_auth" ]
    [ div [ class "header" ] [ text model.message ]
    , form [ onSubmit Submit ]
        [ input [ placeholder "Email", onInput SetEmail, required True ] []
        , input [ placeholder "Пароль", onInput SetPassword, required True ] []
        , input [ class "submit", type_ "submit", value "Войти" ] []
        ]
    ]
