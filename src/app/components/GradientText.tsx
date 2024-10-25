import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  gradient: string;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient,
}) => (
  <span
    className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
  >
    {children}
  </span>
);
