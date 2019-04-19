import Browser exposing (element)
import Html exposing (Html, div, text, form, input, label)
import Html.Attributes exposing
  ( rel, href, class, placeholder
  , required, type_, value, attribute
  )
import Html.Events exposing (onClick, onSubmit, onInput)
import Platform.Cmd as Cmd
import Api exposing (Category, getCategories)
import Http
import Page.Index as Index
import Util exposing (classname)
import UI

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
  , name : String
  , message : String
  , user : Maybe Api.User
  , activeCategory : Category
  , categories : List Category
  , answers : List (Int, Int)
  , questions : List Question
  , questionIndex : Int
  }

type Modal
  = Signin
  | Signup

type Msg
  = SetOpenState Modal Bool
  | SetEmail String
  | SetPassword String
  | SetPasswordAgain String
  | SetName String
  | ToggleAnswer (Int, Int)
  | SetCategory Category
  | GotCategories (Result Http.Error (List Category))
  | SignupSubmit
  | SignupResponse (Result Http.Error String)
  | SigninSubmit
  | SigninResponse (Result Http.Error Api.User)
  | Signout
  | SetQuestionIndex Int

init : () -> (Model, Cmd Msg)
init _ =
  ({ email = ""
   , password = ""
   , passwordAgain = ""
   , name = ""
   , signupOpen = False
   , signinOpen = False
   , message = ""
   , user = Nothing
   , answers = []
   , questionIndex = 0
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
          ({ model | signinOpen = state }, Cmd.none)
        Signup ->
          ({ model | signupOpen = state }, Cmd.none)
    SetEmail email ->
      ({ model | email = email }, Cmd.none)
    SetPassword password ->
      ({ model | password = password }, Cmd.none)
    SetPasswordAgain password ->
      ({ model | passwordAgain = password }, Cmd.none)
    SetName name ->
      ({ model | name = name }, Cmd.none)
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
      (model, Api.signup model.name model.email model.password SignupResponse)
    SignupResponse result ->
      case result of
        Ok token ->
          ({ model | signupOpen = False }, Api.signin model.email model.password SigninResponse)
        Err _ ->
          (model, Cmd.none)
    SigninSubmit ->
      (model, Api.signin model.email model.password SigninResponse)
    SigninResponse result ->
      case result of
        Ok user ->
          ({ model | user = Just user, signinOpen = False }, Cmd.none)
        Err _ ->
          (model, Cmd.none)
    Signout ->
      ({ model | user = Nothing }, Cmd.none)
    SetQuestionIndex index ->
      ({ model | questionIndex = index }, Cmd.none)


view : Model -> Html Msg
view model =
  div []
    [ viewHeader model.user
    , text model.message
    , UI.modal model.signupOpen (SetOpenState Signup) (viewForm Signup)
    , UI.modal model.signinOpen (SetOpenState Signin) (viewForm Signin)
    , viewCategories model.categories model.activeCategory
    , viewTest model.questions model.questionIndex
    , UI.button [] "Закончить"
    ]

viewHeader user =
  div [ class "_header" ]
    [ div [ class "logo" ] [ text "Hello world" ]
    , case user of
        Just profile ->
          div [ class "nav" ]
            [ UI.button [] profile.name
            , UI.button [ onClick Signout ] "Выйти"
            ]
        Nothing ->
          div [ class "nav" ]
            [ UI.button [ onClick (SetOpenState Signup True) ] "Создать аккаунт"
            , UI.button [ onClick (SetOpenState Signin True) ] "Войти"
            ]
    ]

viewForm : Modal -> Html Msg
viewForm kind =
  let
    baseFields =
      [ input [ placeholder "Email", onInput SetEmail, required True ] []
      , input [ placeholder "Пароль", onInput SetPassword, required True ] []
      ]
    (handleSubmit, fields) =
      case kind of
        Signup ->
          (SignupSubmit,
            [ input [ placeholder "Ваше имя", onInput SetName, required True ] [] ]
            ++ baseFields
            ++ [ input [ placeholder "Повторите пароль", onInput SetPasswordAgain, required True ] [] ]
          )
        Signin ->
          (SigninSubmit, baseFields)
  in
    div [ class "_auth" ]
      [ div [ class "header" ] [ text "Заполните поля" ]
      , form [ onSubmit handleSubmit ]
          (fields ++ [ input [ class "submit", type_ "submit", value "Войти" ] [] ])
      ]

viewQuestion question =
  div [ class "_question" ]
    [ div [ class "header" ] [ text question.text ]
    , div [ class "answer-list" ]
      (List.map (\answer ->
        label [ class "answer" ]
          [ input [ type_ "checkbox", onInput (\s -> ToggleAnswer (question.id, answer.id))] []
          , text answer.text
          ]
      ) question.answers)
    ]

viewTest questions questionIndex =
  div
    [ class "_test"
    , attribute "style" ("--active-index:" ++ String.fromInt questionIndex)
    ]
    [ div [ class "frame" ]
      [ UI.button
          [ classname ("inactive", questionIndex <= 0)
          , onClick (SetQuestionIndex (questionIndex - 1))
          ]
          "<"
      , div [ class "question-list" ] (List.map viewQuestion questions)
      , UI.button
          [ classname ("inactive", questionIndex + 1 >= List.length questions)
          , onClick (SetQuestionIndex (questionIndex + 1))
          ]
          ">"
      ]
    , div [ class "question-nav" ]
        (List.indexedMap (\index _ ->
          div
            [ classname ("active", index == questionIndex)
            , onClick (SetQuestionIndex index)
            ]
            []
        ) questions)
    ]

viewCategories categories activeCategory =
  div [ class "_categories" ]
    (List.map (\category ->
      div
        [ class "category"
        , classname ("active", category == activeCategory)
        , onClick (SetCategory category)
        ]
        [ text category.name ]
      )
      categories
    )
