import Browser exposing (element)
import Html exposing (Html, div, text, form, input, label)
import Html.Attributes exposing (rel, href, class, placeholder, required, type_, value)
import Html.Events exposing (onClick, onSubmit, onInput)
import Platform.Cmd as Cmd
import Api exposing (Category, getCategories)
import Http
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
  , activeCategory : Category
  , categories : List Category
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
  | SetCategory Category
  | GotCategories (Result Http.Error (List Category))
  | SignupSubmit
  | SignupResponse (Result Http.Error String)
  | Signout

init : () -> (Model, Cmd Msg)
init _ =
  ({ email = ""
   , password = ""
   , passwordAgain = ""
   , signupOpen = False
   , signinOpen = False
   , message = ""
   , user = Guest
   , answers = []
   , categories =
      [ Category 0 "cat1"
      , Category 1 "cat2"
      , Category 2 "cat3"
      ]
   , activeCategory = Category 3 "tes"
   , questions =
      [ Question 0 "foo?" [ Answer 0 "bar", Answer 1 "baz" ]
      , Question 1 "qux?" [ Answer 2 "quux", Answer 3 "cat" ]
      , Question 2 "qux?" [ Answer 4 "quux", Answer 6 "car" ]
      , Question 3 "qux?" [ Answer 5 "zzzz", Answer 7 "zxcz" ]
      ]
   }
  , getCategories GotCategories
  )

main =
  element { init = init, update = update, view = view, subscriptions = \_ -> Sub.none }

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
    SetCategory category ->
      ({ model | activeCategory = category }, Cmd.none)
    GotCategories result ->
      case result of
        Ok categories ->
          ({ model | categories = categories }, Cmd.none)
        Err _ ->
          (model, Cmd.none)
    SignupSubmit ->
      (model, Api.authorize Api.Signup model.email model.password SignupResponse)
    SignupResponse result ->
      case result of
        Ok token ->
          (model, Cmd.none)
        Err _ ->
          (model, Cmd.none)
    Signout ->
      ({ model | user = Guest }, Cmd.none)


view : Model -> Html Msg
view model =
  div []
    [ viewHeader model.user
    , text model.message
    , Modal.view model.signinOpen (SetOpenState Signup) (viewForm Signup)
    , Modal.view model.signupOpen (SetOpenState Signin) (viewForm Signin)
    , viewCategories model.categories model.activeCategory
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
    , form [ onSubmit SignupSubmit ]
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

viewQuestion question =
  div [ class "_question" ]
    [ div [ class "header" ] [ text question.text ]
    , div [ class "answer-list" ]
        (List.map (\answer ->
          label [ class "answer" ]
            [ input [ type_ "checkbox", onInput (\s -> ToggleAnswer (question.id, answer.id))] [], text answer.text
            ]
        ) question.answers)
    ]

viewTest questions =
  div [ class "_test" ]
    (List.map viewQuestion questions ++ [ Button.view [] "Закончить" ])

viewCategories categories activeCategory =
  div [ class "_categories" ]
    (List.map (\category ->
      div
        [ class "category"
        , class (if category == activeCategory then "active" else "")
        , onClick (SetCategory category)
        ]
        [ text category.name ]
      )
      categories
    )
