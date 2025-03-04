import { LinkProps, Link as LinkRouter } from "react-router-dom";

const Link = (props: LinkProps) => {
  return <LinkRouter className="text-gray-800" {...props} />;
};

export default Link;
