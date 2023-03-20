import React from "react";
import { styled } from "nativewind";

import { Text, type TextWeights } from "../typography/Text";

export type LabelProps = {
  /** Controls the font weight of the default Inter font-family as the default font-weight property doesn't work with custom fonts */
  weight?: TextWeights;
};

const LabelRoot: React.FC<React.PropsWithChildren<LabelProps>> = ({ children, weight = "medium" }) => {
  return (
    <Text weight={weight} className="mb-xs text-sm text-label">
      {children}
    </Text>
  );
};

export const Label = styled(LabelRoot);
