import { LinkGroupImageType } from "@/types/structs/linkGroupImageType";

export const getImageForLinkGroupImageType = (
  imageType: LinkGroupImageType
) => {
  switch (imageType) {
    case LinkGroupImageType.FACEBOOK:
      return "/social-media/facebook.svg";
    case LinkGroupImageType.INSTAGRAM:
      return "/social-media/instagram.svg";
    case LinkGroupImageType.LINKEDIN:
      return "/social-media/linkedin.svg";
    case LinkGroupImageType.TIK_TOK:
      return "/social-media/tik-tok.svg";
    case LinkGroupImageType.X:
      return "/social-media/twitter-x.svg";
    case LinkGroupImageType.YOUTUBE:
      return "/social-media/youtube.svg";
    case LinkGroupImageType.WEBSITE:
      return "/social-media/website.svg";
    case LinkGroupImageType.HASHTAG:
      return "/social-media/hashtag.svg";
    default:
      console.log("Image type " + imageType + " not supported");
      return;
  }
};
