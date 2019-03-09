module Form.Auth exposing (view)

import Html exposing (Html, form, input, label, text, div)
import Html.Attributes exposing (class, placeholder, type_, value, required)
import Html.Events exposing (onInput)

import Json.Encode as Encode
import Json.Decode as Decode
import Http
import Platform.Cmd as Cmd

type alias Model =
  { email : String
  , password : String
  }

type Msg
  = SetEmail String
  | SetPassword String
  | Submit
  | Response (Result Http.Error String)

post model =
  let
    body =
      Encode.object
        [ ("email", Encode.string model.email)
        , ("password", Encode.string model.password)
        ]
        |> Http.jsonBody
    in
      Http.post
        { body = body
        , url = "/api/auth/signin"
        , expect = Http.expectJson Response (Decode.field "token" Decode.string)
        }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SetEmail email ->
      ({ model | email = email }, Cmd.none)
    SetPassword password ->
      ({ model | password = password }, Cmd.none)
    Submit ->
      (model, post model)
    Response _ ->
      (model, Cmd.none)

view : Bool -> Html Msg
view signup =
  div [ class "_auth" ]
    [ div [ class "header" ] [ text "Логин" ]
    , form []
      [ input [ placeholder "Email", onInput SetEmail, required True ] []
      , input [ placeholder "Пароль", onInput SetPassword, required True ] []
      , input [ class "submit", type_ "submit", value "Войти" ] []
      ]
    ]
