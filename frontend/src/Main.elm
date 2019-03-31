import Browser exposing (element)
import Html exposing (Html, div, text, form, input, label)
import Html.Attributes exposing (rel, href, class, placeholder, required, type_, value)
import Html.Events exposing (onClick, onSubmit, onInput)
import Platform.Cmd as Cmd
import Http
import Json.Encode as Encode
import Json.Decode as Decode

import Page.Index as Index
import Button
import Modal

type alias Answer =
  { id : Int
  , text : String
  }

type alias Question =
  { id : Int
  , text : String
  , answers : List Answer
  }

type alias Model =
  { signupOpen : Bool
  , signinOpen : Bool
  , email : String
  , password : String
  , passwordAgain : String
  , message : String
  , user : User
  , answers : List (Int, Int)
  , questions : List Question
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
  | ToggleAnswer (Int, Int)
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
   , answers = []
   , questions =
      [ Question 0 "foo?" [ Answer 0 "bar", Answer 1 "baz" ]
      , Question 1 "qux?" [ Answer 2 "quux", Answer 3 "cat" ]
      , Question 2 "qux?" [ Answer 4 "quux", Answer 6 "car" ]
      , Question 3 "qux?" [ Answer 5 "zzzz", Answer 7 "zxcz" ]
      ]
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
    ToggleAnswer (questionid, answerid) ->
      let
        answers = List.filter (\(_, id) -> id /= answerid) model.answers
      in
        if List.length answers /= List.length model.answers then
          ({ model | answers = answers }, Cmd.none)
        else
          ({ model | answers = (questionid, answerid) :: model.answers }, Cmd.none)
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
    , text model.message
    , Modal.view model.signinOpen (SetOpenState Signup) (viewForm Signup)
    , Modal.view model.signupOpen (SetOpenState Signin) (viewForm Signin)
    , viewTest model.questions
    ]

viewHeader user =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , case user of
        Authorized name ->
          div [ class "nav" ]
            [ Button.view [] name
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

viewAnswer onToggle answer =
  label [ class "answer" ]
    [ input [ type_ "checkbox", onInput (\s -> onToggle answer.id)] [], text answer.text
    ]

viewQuestion question =
  div [ class "_question" ]
    [ div [ class "header" ] [ text question.text ]
    , div [ class "answer-list" ] (List.map (viewAnswer ( \id -> ToggleAnswer (question.id, id) )) question.answers)
    ]

viewTest questions =
  div [ class "_test" ]
    (List.map viewQuestion questions ++ [ Button.view [] "Закончить" ])
