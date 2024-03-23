import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/comps/ui/navigation-menu";
import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, forwardRef } from "react";

export const NavMenu: FC<{ PassProp: any; child: any }> = ({
  PassProp,
  child,
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <PassProp>{child}</PassProp>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export const NavItem: FC<{
  label: string;
  onClick: () => void;
  PassProp: any;
  child: any;
  depth: number;
}> = ({ label, onClick, child, PassProp, depth }) => {
  if (depth <= 1) {
    const childs = get(
      child,
      "props.meta.item.component.props.child.content.childs"
    );

    if (Array.isArray(childs) && childs.length > 0) {
      return (
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={onClick} className="c-rounded-md">
            <div>{label}</div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="c-grid c-min-w-[200px]">
              <PassProp depth={depth + 1}>{child}</PassProp>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    return (
      <NavigationMenuItem className="c-rounded-md">
        <NavigationMenuLink
          className={navigationMenuTriggerStyle()}
          onClick={onClick}
        >
          {label}
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  } else {
    return (
      <li>
        <NavigationMenuLink asChild>
          <div
            className={cx(
              "c-cursor-pointer c-px-2 c-py-[6px] c-border-b",
              css`
                &:hover {
                  background: #ebf3fc;
                }
              `
            )}
            onClick={onClick}
          >
            {label}
          </div>
        </NavigationMenuLink>
      </li>
    );
  }
};

const ListItem = forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cx(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
          onClick={(e) => {
            e.preventDefault();
            if (props.onClick) {
              props.onClick(e);
            }
          }}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];
