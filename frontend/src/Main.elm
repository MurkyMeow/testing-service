import Browser exposing (application)
import Browser.Navigation as Navigation
import Url
import Url.Builder as Builder
import Url.Parser as Parser exposing ((</>))
import Html exposing (Html, div, text, form, input, label, a)
import Html.Attributes exposing
  ( rel, href, class, placeholder
  , required, type_, value, attribute
  )
import Html.Events exposing (onClick, onSubmit, onInput)
import Platform.Cmd as Cmd
import Api
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
  , activeCategory : Api.Category
  , categories : List Api.Category
  , answers : List (Int, Int)
  , questions : List Api.Question
  , tests : List Api.Test
  , questionIndex : Int
  , testId : Int
  , key : Navigation.Key
  , page : Page
  }

type Page
  = Index
  | Categories
  | Category Int
  | Test Int

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
  | SetCategory Api.Category
  | GotCategories (Result Http.Error (List Api.Category))
  | GotTests (Result Http.Error (List Api.Test))
  | SetTestId Int
  | GotQuestions (Result Http.Error (List Api.Question))
  | SignupSubmit
  | SignupResponse (Result Http.Error String)
  | SigninSubmit
  | SigninResponse (Result Http.Error Api.User)
  | Signout
  | SetQuestionIndex Int
  | UrlChanged Url.Url
  | LinkClicked Browser.UrlRequest

init : () -> Url.Url -> Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
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
   , activeCategory = Api.Category 3 "tes"
   , questions = []
   , key = key
   , page = Index
   }
  , Api.getCategories GotCategories
  )

main =
  application
    { init = init
    , update = update
    , view = view
    , subscriptions = \_ -> Sub.none
    , onUrlChange = UrlChanged
    , onUrlRequest = LinkClicked
    }

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
    LinkClicked urlRequest ->
      case urlRequest of
        Browser.Internal url ->
          (model, Navigation.pushUrl model.key (Url.toString url))
        Browser.External href ->
          (model, Cmd.none)
    UrlChanged url ->
      let
        parser =
          Parser.oneOf
            [ Parser.map Index Parser.top
            , Parser.map Categories (Parser.s "categories")
            , Parser.map Category (Parser.s "category" </> Parser.int)
            , Parser.map Test (Parser.s "test" </> Parser.int)
            ]
      in
        case Parser.parse parser url of
          Just route ->
            case route of
              Index ->
                ({ model | page = Index }, Cmd.none)
              Categories ->
                ({ model | page = Categories }, Cmd.none)
              Category id ->
                ({ model | page = Category id }, Api.getTests id GotTests)
              Test id ->
                ({ model | page = Test id }, Api.getQuestions id GotQuestions)
          Nothing ->
            ({ model | page = Index }, Cmd.none)



view : Model -> Browser.Document Msg
view model =
  { title = "test"
  , body =
      [ viewHeader model.user
      , text model.message
      , UI.modal model.signupOpen (SetOpenState Signup) (viewForm Signup)
      , UI.modal model.signinOpen (SetOpenState Signin) (viewForm Signin)
      , div [ class "app-content" ]
          [ case model.page of
              Index ->
                text ""
              Categories ->
                viewCategories model.categories model.activeCategory
              Category id ->
                viewTests model.tests model.testId
              Test id ->
                viewTest model.questions model.questionIndex
          ]
      ]
  }

viewHeader user =
  let
    (breadcrumbs, accountButtons) =
      case user of
        Just profile ->
          ( [ a [ href "/categories" ] [ text "Категории" ]
            , a [ href "/tests" ] [ text "Тесты" ]
            , a [ href "/test" ] [ text "Тест" ]
            ]
          , [ UI.button [] profile.name
            , UI.button [ onClick Signout ] "Выйти"
            ]
          )
        Nothing ->
          ( [ text "" ]
          , [ UI.button [ onClick (SetOpenState Signup True) ] "Создать аккаунт"
            , UI.button [ onClick (SetOpenState Signin True) ] "Войти"
            ]
          )
  in
    div [ class "header" ]
      [ div [ class "header-logo" ] [ text "Hello world" ]
      , div [ class "header-nav-breadcrumbs" ] breadcrumbs
      , div [ class "header-nav-account" ] accountButtons
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
      a
        [ class "tests-item"
        , classname ("active", activeid == test.id)
        , href (Builder.absolute [ "test", String.fromInt test.id ] [])
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
      a
        [ class "categories-item"
        , href (Builder.relative [ "category", String.fromInt category.id ] [])
        , classname ("active", category == activeCategory)
        ]
        [ text category.name ]
      )
      categories
    )
