import NavBarColourModeToggle from "./navbar.colour.mode.component";
import uiVendor from "@src/clients/ui.framework/vendor";
import type { ButtonClickHandlerType } from "@src/types/analytics.types";
import type { ChangeEvent } from "react";

interface NavBarColourModeToggleProps {
  tracker: ButtonClickHandlerType;
}

export default function NavBarColourModeContainer({
  tracker,
}: NavBarColourModeToggleProps) {
  const { colourMode, toggle } = uiVendor.colourModeHook();

  const handleChange = (e: ChangeEvent<HTMLElement>) => {
    e.target.blur();
    tracker(e, "Colour Mode Toggle");
    toggle();
  };

  return (
    <NavBarColourModeToggle
      colourMode={colourMode}
      handleChange={handleChange}
    />
  );
}
