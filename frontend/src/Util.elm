module Util exposing (classname)

import Html.Attributes exposing (class)

classname (name, cond) =
  class (if cond then name else "")
