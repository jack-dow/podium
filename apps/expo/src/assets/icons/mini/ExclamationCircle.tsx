import * as React from "react";
import { Path } from "react-native-svg";

import { MiniIcon } from "../MiniIcon";

export const ExclamationCircleIcon = MiniIcon(
  "ExclamationCircleIcon",
  <Path
    fillRule="evenodd"
    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
    clipRule="evenodd"
  />,
);
