import Browser exposing (element)
import Html exposing (Html, div, text, form, input)
import Html.Attributes exposing (rel, href, class, placeholder, required, type_, value)
import Html.Events exposing (onClick, onSubmit, onInput)
import Platform.Cmd as Cmd
import Http
import Json.Encode as Encode
import Json.Decode as Decode

import Page.Index as Page
import UI.Button as Button
import UI.Modal as Modal

-- TODO: decompose Msg Model and update into small pieces?

type alias Model =
  { signupOpen : Bool
  , signinOpen : Bool
  , email : String
  , password : String
  , passwordAgain : String
  , message : String
  , user : User
  }

type User
  = Guest
  | Authorized String

type Modal
  = Signin
  | Signup

type Msg
  = SetOpenState Modal Bool
  | SetEmail String
  | SetPassword String
  | SetPasswordAgain String
  | Signout
  | Submit
  | Response (Result Http.Error String)

init : () -> (Model, Cmd Msg)
init _ =
  ({ email = ""
   , password = ""
   , passwordAgain = ""
   , signupOpen = False
   , signinOpen = False
   , message = ""
   , user = Authorized "Meow"
   }
  , Cmd.none
  )

main =
  element { init = init, update = update, view = view, subscriptions = \_ -> Sub.none }

submit =
  let
    body = Encode.object
      [ ("query", Encode.string "{ hello }")
      ]
      |> Http.jsonBody
  in
    Http.post
      { url = "http://localhost:3000/api"
      , body = body
      , expect = Http.expectJson Response (Decode.field "data" (Decode.field "hello" Decode.string))
      }

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    SetOpenState modal state ->
      case modal of
        Signin ->
          ({ model | signupOpen = state }, Cmd.none)
        Signup ->
          ({ model | signinOpen = state }, Cmd.none)
    SetEmail email ->
      ({ model | email = email }, Cmd.none)
    SetPassword password ->
      ({ model | password = password }, Cmd.none)
    SetPasswordAgain password ->
      ({ model | passwordAgain = password }, Cmd.none)
    Response result ->
      case result of
        Ok message ->
          ({ model | message = message }, Cmd.none)
        _ ->
          ({ model | message = "Ошибка" }, Cmd.none)
    Submit ->
      (model, submit)
    Signout ->
      ({ model | user = Guest }, Cmd.none)

view : Model -> Html Msg
view model =
  div []
    [ viewHeader model.user
    , Page.view
    , text model.message
    , Modal.view model.signinOpen (SetOpenState Signup) (viewForm Signup)
    , Modal.view model.signupOpen (SetOpenState Signin) (viewForm Signin)
    , Html.node "link" [ rel "stylesheet", href "/main.css" ] []
    ]

viewHeader user =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , case user of
        Authorized name ->
          div [ class "nav" ]
            [ Button.view [] ("Здравствуйте, " ++ name)
            , Button.view [ onClick Signout ] "Выйти"
            ]
        Guest ->
          div [ class "nav" ]
            [ Button.view [ onClick (SetOpenState Signup True) ] "Создать аккаунт"
            , Button.view [ onClick (SetOpenState Signin True) ] "Войти"
            ]
    ]

viewForm : Modal -> Html Msg
viewForm kind =
  div [ class "_auth" ]
    [ div [ class "header" ] [text "Заполните поля" ]
    , form [ onSubmit Submit ]
        [ input [ placeholder "Email", onInput SetEmail, required True ] []
        , input [ placeholder "Пароль", onInput SetPassword, required True ] []
        , case kind of
            Signup ->
              input [ placeholder "Повторите пароль", onInput SetPasswordAgain, required True ] []
            Signin ->
              text ""
        , input [ class "submit", type_ "submit", value "Войти" ] []
        ]
    ]
