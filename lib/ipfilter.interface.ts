export type IpFilterModuleOptions = {
  whitelist?: string[];
  blacklist?: string[];

  useDenyException?: boolean;
};

export interface IpFilterDenyHandler {
  handle(): boolean;
}
