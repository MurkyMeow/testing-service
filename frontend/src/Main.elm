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
  , questions : List Api.Question
  , tests : List Api.Test
  , questionIndex : Int
  , testId : Int
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
  | GotTests (Result Http.Error (List Api.Test))
  | SetTestId Int
  | GotQuestions (Result Http.Error (List Api.Question))
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
   , tests = []
   , answers = []
   , questionIndex = 0
   , testId = 0
   , categories = []
   , activeCategory = Category 3 "tes"
   , questions = []
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
      ({ model | activeCategory = category }, Api.getTests category.id GotTests)
    GotCategories result ->
      case result of
        Ok categories ->
          ({ model | categories = categories }, Cmd.none)
        Err _ ->
          (model, Cmd.none)
    GotTests result ->
      case result of
        Ok tests ->
          ({ model | tests = tests }, Cmd.none)
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
    SetTestId testid ->
      ({ model | testId = testid }, Api.getQuestions testid GotQuestions)
    GotQuestions result ->
      case result of
        Ok questions ->
          ({ model | questions = questions, questionIndex = 0 }, Cmd.none)
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
    , div [ class "app-content" ]
        [ viewCategories model.categories model.activeCategory
        , viewTests model.tests model.testId
        , if List.length model.questions > 0 then
            viewTest model.questions model.questionIndex
          else
            text ""
        ]
    ]

viewHeader user =
  div [ class "header" ]
    [ div [ class "header-logo" ] [ text "Hello world" ]
    , case user of
        Just profile ->
          div [ class "header-nav" ]
            [ UI.button [] profile.name
            , UI.button [ onClick Signout ] "Выйти"
            ]
        Nothing ->
          div [ class "header-nav" ]
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
    div [ class "auth" ]
      [ div [ class "auth-header" ] [ text "Заполните поля" ]
      , form [ onSubmit handleSubmit ]
          (fields ++ [ input [ class "auth-submit", type_ "submit", value "Войти" ] [] ])
      ]

viewTests tests activeid =
  div [ class "tests" ]
    (List.map (\test ->
      div
        [ class "tests-item"
        , classname ("active", activeid == test.id)
        , onClick (SetTestId test.id)
        ]
        [ text test.name ]
    ) tests)

viewQuestion question =
  div [ class "question" ]
    [ div [ class "question-header" ] [ text question.text ]
    , div [ class "question-answers" ]
      (List.map (\answer ->
        label [ class "question-answers-item" ]
          [ input [ type_ "checkbox", onInput (\s -> ToggleAnswer (question.id, answer.id))] []
          , text answer.text
          ]
      ) question.answers)
    ]

viewTest questions questionIndex =
  div
    [ class "test"
    , attribute "style" ("--active-index:" ++ String.fromInt questionIndex)
    ]
    [ div [ class "test-frame" ]
      [ UI.button
          [ classname ("inactive", questionIndex <= 0)
          , onClick (SetQuestionIndex (questionIndex - 1))
          ]
          "<"
      , div [ class "test-questions" ] (List.map viewQuestion questions)
      , UI.button
          [ classname ("inactive", questionIndex + 1 >= List.length questions)
          , onClick (SetQuestionIndex (questionIndex + 1))
          ]
          ">"
      ]
    , div [ class "test-nav" ]
        (List.indexedMap (\index _ ->
          div
            [ classname ("active", index == questionIndex)
            , onClick (SetQuestionIndex index)
            ]
            []
        ) questions)
    , UI.button [] "Закончить"
    ]

viewCategories categories activeCategory =
  div [ class "categories" ]
    (List.map (\category ->
      div
        [ class "categories-item"
        , classname ("active", category == activeCategory)
        , onClick (SetCategory category)
        ]
        [ text category.name ]
      )
      categories
    )
