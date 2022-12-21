import { useColorMode } from "@chakra-ui/react";
import type { UIVendorColourModeType } from "@src/types/clients/ui.framework/vendor.types";

export default function useChakraColourMode() {
  const { toggleColorMode, colorMode } = useColorMode();

  return {
    colourMode: colorMode as UIVendorColourModeType,
    toggle: toggleColorMode,
  };
}
