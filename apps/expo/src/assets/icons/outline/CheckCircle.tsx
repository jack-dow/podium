import * as React from "react";
import { Path } from "react-native-svg";

import { OutlineIcon } from "../OutlineIcon";

export const CheckCircleIcon = OutlineIcon(
  "CheckCircleIcon",
  <Path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
  />,
);
