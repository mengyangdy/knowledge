import * as iconList from "@/assets";
import { copyTextToClipboard } from "@/lib";
import { IconProps } from "@/types/type";
import { Tooltip } from "@douyinfe/semi-ui";
import { motion } from "framer-motion";

type Platform =
  | "github"
  | "twitter"
  | "youtube"
  | "telegram"
  | "bilibili"
  | "mail"
  | "rss"
  | "微信"
  | "微信公众号";

type TypeSocialLinkProps = {
  platform?: Platform | string;
  icon?: string;
  isPicture?: boolean;
  href?: string;
  url?: string;
  email?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

type IconName = keyof typeof iconList;

const IconComponents: Record<
  IconName,
  React.ComponentType<IconProps>
> = iconList;

function SocialLink({
  platform,
  href,
  isPicture,
  icon,
  url,
  email,
}: TypeSocialLinkProps) {
  const Icon = IconComponents[icon as IconName];

  function handleClick() {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
    if (email) {
			copyTextToClipboard(email)
    }
    if (href) {
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={handleClick}
    >
      {icon && (
        <Icon className="text-2xl text-zinc-400 transition group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
      )}
    </motion.div>
  );
}

export default SocialLink;
