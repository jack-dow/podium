import * as React from "react";
import { Path } from "react-native-svg";

import { MiniIcon } from "../MiniIcon";

export const CheckCircleIcon = MiniIcon(
  "CheckCircleIcon",
  <Path
    fillRule="evenodd"
    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5z"
    clipRule="evenodd"
  />,
);
