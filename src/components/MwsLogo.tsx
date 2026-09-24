import { type ImgHTMLAttributes } from "react";

export type MwsLogoVariant = "crest" | "horizontal" | "vertical";

/**
 * Replace these paths with the final deployment-server URLs when the official
 * logo files are available. Keeping them here gives the homepage and package
 * consumers one canonical source for all MWS logo variants.
 */
const MWS_LOGO_ASSET_VERSION = "20260721-2";

export const mwsLogoSources: Record<MwsLogoVariant, string> = {
  crest: `/images/brand/mws-logo-crest.png?v=${MWS_LOGO_ASSET_VERSION}`,
  horizontal: `/images/brand/mws-logo-horizontal.png?v=${MWS_LOGO_ASSET_VERSION}`,
  vertical: `/images/brand/mws-logo-vertical.png?v=${MWS_LOGO_ASSET_VERSION}`,
};

const mwsLogoDimensions: Record<
  MwsLogoVariant,
  { width: number; height: number }
> = {
  crest: { width: 512, height: 512 },
  horizontal: { width: 1200, height: 360 },
  vertical: { width: 720, height: 960 },
};

export type MwsLogoProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "children" | "src"
> & {
  variant?: MwsLogoVariant;
  /** Overrides the configured deployment URL for this instance. */
  src?: string;
  /** Accessible image description. Omit it when the logo is decorative. */
  title?: string;
};

export function MwsLogo({
  variant = "crest",
  src,
  title,
  loading = "lazy",
  decoding = "async",
  width,
  height,
  ...props
}: MwsLogoProps) {
  const dimensions = mwsLogoDimensions[variant];
  // Only default both dimensions when neither is set, so a single-dimension
  // override lets the browser keep the intrinsic aspect ratio.
  const sizeProps =
    width !== undefined || height !== undefined
      ? { width, height }
      : { width: dimensions.width, height: dimensions.height };

  return (
    <img
      src={src ?? mwsLogoSources[variant]}
      alt={title ?? ""}
      loading={loading}
      decoding={decoding}
      {...sizeProps}
      {...props}
    />
  );
}
