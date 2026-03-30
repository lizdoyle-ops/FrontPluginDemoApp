export interface EmailBranding {
  companyName: string;
  brandColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  /** Shown in email footer (e.g. plugin name). */
  appTitle?: string;
}
