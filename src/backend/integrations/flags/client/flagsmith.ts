import Flagsmith from "flagsmith-nodejs";
import type { FlagVendorClientInterface } from "../../../../types/integrations/flags/vendor.types";
import type { Flags } from "flagsmith-nodejs";

export default class FlagSmithClient implements FlagVendorClientInterface {
  protected environment: string;

  constructor(environment: unknown) {
    this.environment = environment as string;
  }

  isEnabled = async (flagName: string, group?: string) => {
    const flagsmith = new Flagsmith({
      environmentKey: this.environment,
    });

    let flags: Flags;
    if (group) {
      flags = await flagsmith.getIdentityFlags(group);
    } else {
      flags = await flagsmith.getEnvironmentFlags();
    }

    return flags.isFeatureEnabled(flagName);
  };
}
