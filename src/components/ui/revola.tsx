"use client";

import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";
import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Drawer as DrawerPrimitive, Content as VaulDrawerContent } from "vaul";
import useMediaQuery from "~/hooks/use-media-query";
import { cn } from "~/lib/utils";

type DrawerType = ComponentProps<typeof DrawerPrimitive.Root>;

type ResponsiveDialogContextProps = {
  modal?: boolean;
  dismissible?: boolean;
  direction?: "top" | "right" | "bottom" | "left";
  onlyDrawer?: boolean;
  onlyDialog?: boolean;
  alert?: boolean;
};

type ResponsiveDialogProviderProps = {
  children: ReactNode;
} & ResponsiveDialogContextProps;

const ResponsiveDialogContext = createContext<ResponsiveDialogContextProps>({});

const ResponsiveDialogProvider = ({
  modal = true,
  dismissible = true,
  direction = "bottom",
  onlyDrawer = false,
  onlyDialog = false,
  alert = false,
  children,
}: ResponsiveDialogProviderProps) => {
  return (
    <ResponsiveDialogContext.Provider
      value={{ modal, dismissible, direction, onlyDrawer, onlyDialog, alert }}
    >
      {children}
    </ResponsiveDialogContext.Provider>
  );
};

const useResponsiveDialog = () => {
  const context = useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      "useResponsiveDialog must be used within a <ResponsiveDialog />"
    );
  }

  return context;
};

const ResponsiveDialog = ({
  modal = true,
  dismissible = true,
  direction = "bottom",
  onlyDrawer = false,
  onlyDialog = false,
  alert = false,
  shouldScaleBackground = true,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: DrawerType & {
  onlyDrawer?: boolean;
  onlyDialog?: boolean;
  alert?: boolean;
}) => {
  const [internalState, setInternalState] = useState<boolean>(false);

  const isControlledOpen = typeof controlledOpen === "undefined";
  const toggleInternalState = () => setInternalState((prev) => !prev);

  const open = isControlledOpen ? internalState : controlledOpen;
  const onOpenChange = isControlledOpen
    ? toggleInternalState
    : controlledOnOpenChange;

  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialog = shouldUseDialog ? Root : DrawerPrimitive.Root;

  const effectiveModal = alert ? true : modal;
  const effectiveDismissible = alert ? true : dismissible;

  return (
    <ResponsiveDialogProvider
      alert={alert}
      direction={direction}
      dismissible={effectiveDismissible}
      modal={effectiveModal}
      onlyDialog={onlyDialog}
      onlyDrawer={onlyDrawer}
    >
      <ResponsiveDialog
        direction={direction}
        dismissible={effectiveDismissible}
        modal={effectiveModal}
        onOpenChange={onOpenChange}
        open={open}
        shouldScaleBackground={shouldScaleBackground}
        {...props}
        {...(!shouldUseDialog && { autoFocus: true })}
      />
    </ResponsiveDialogProvider>
  );
};
ResponsiveDialog.displayName = "ResponsiveDialog";

const ResponsiveDialogTrigger = ({
  ...props
}: ComponentProps<typeof Trigger>) => {
  const { onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const TResponsiveDialogTrigger = shouldUseDialog
    ? Trigger
    : DrawerPrimitive.Trigger;
  return <TResponsiveDialogTrigger {...props} />;
};
ResponsiveDialogTrigger.displayName = "ResponsiveDialogTrigger";

const ResponsiveDialogPortal = ({
  ...props
}: ComponentProps<typeof Portal>) => {
  const { onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogPortal = shouldUseDialog
    ? Portal
    : DrawerPrimitive.Portal;
  return <ResponsiveDialogPortal {...props} />;
};
ResponsiveDialogPortal.displayName = "ResponsiveDialogPortal";

const ResponsiveDialogOverlay = ({
  className,
  ...props
}: ComponentProps<typeof Overlay>) => {
  const { onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogOverlay = shouldUseDialog
    ? Overlay
    : DrawerPrimitive.Overlay;
  return (
    <ResponsiveDialogOverlay
      {...props}
      className={cn(
        "sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40 sm:data-[state=closed]:animate-out sm:data-[state=open]:animate-in",
        className
      )}
    />
  );
};
ResponsiveDialogOverlay.displayName = "ResponsiveDialogOverlay";

const ResponsiveDialogClose = ({ ...props }: ComponentProps<typeof Close>) => {
  const { dismissible, alert, onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogClose = shouldUseDialog ? Close : DrawerPrimitive.Close;

  const shouldPreventClose = !(dismissible || alert);

  return (
    <ResponsiveDialogClose
      aria-label="Close"
      {...(shouldPreventClose && { onClick: (e) => e.preventDefault() })}
      {...props}
    />
  );
};
ResponsiveDialogClose.displayName = "ResponsiveDialogClose";

const ResponsiveDialogContentVariants = cva("fixed z-[9999] bg-background", {
  variants: {
    device: {
      desktop:
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 top-[50%] left-[50%] grid h-auto max-h-[min(640px,80dvh)] w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in",
      mobile: "flex ",
    },
    direction: {
      bottom: "",
      top: "",
      left: "",
      right: "",
    },
  },
  defaultVariants: {
    device: "desktop",
    direction: "bottom",
  },
  compoundVariants: [
    {
      device: "mobile",
      direction: "bottom",
      className:
        "inset-x-0 bottom-0 mt-24 h-fit max-h-[85%] flex-col rounded-t-[10px] border border-primary/10 border-b-0 pt-4",
    },
    {
      device: "mobile",
      direction: "top",
      className:
        "inset-x-0 top-0 mb-24 h-fit max-h-[85%] flex-col rounded-b-[10px] border border-primary/10 border-b-0",
    },
    {
      device: "mobile",
      direction: "left",
      className:
        "top-2 bottom-2 left-2 flex w-[310px] bg-transparent outline-none [--initial-transform:calc(100%+8px)]",
    },
    {
      device: "mobile",
      direction: "right",
      className:
        "top-2 right-2 bottom-2 w-[310px] bg-transparent outline-none [--initial-transform:calc(100%+8px)]",
    },
  ],
});

const ResponsiveDialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof Content> & {
    hideCloseButton?: boolean;
  }
>(({ className, children, hideCloseButton = false, ...props }, ref) => {
  const { direction, modal, dismissible, alert, onlyDrawer, onlyDialog } =
    useResponsiveDialog();

  const isMobile = useMediaQuery("(min-width: 640px)");
  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogContent = shouldUseDialog ? Content : VaulDrawerContent;

  const shouldPreventEscape = !(dismissible || alert);
  const shouldPreventOutsideInteraction =
    !(modal && (dismissible || alert)) || alert;

  return (
    <ResponsiveDialogPortal>
      <ResponsiveDialogOverlay />
      <ResponsiveDialogContent
        ref={ref}
        {...props}
        {...(shouldPreventEscape &&
          shouldUseDialog && { onEscapeKeyDown: (e) => e.preventDefault() })}
        {...(shouldPreventOutsideInteraction &&
          shouldUseDialog && {
            onInteractOutside: (e) => e.preventDefault(),
          })}
        {...(!shouldUseDialog &&
          shouldPreventOutsideInteraction && {
            onPointerDownOutside: (e) => e.preventDefault(),
            onInteractOutside: (e) => e.preventDefault(),
          })}
        className={cn(
          ResponsiveDialogContentVariants({
            device: shouldUseDialog ? "desktop" : "mobile",
            direction,
          }),
          className
        )}
      >
        {!shouldUseDialog && direction === "bottom" && (
          <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-muted-foreground/25 data-[vaul-handle]:h-1.5 data-[vaul-handle]:w-14 data-[vaul-handle]:pb-1.5 dark:bg-muted" />
        )}
        {!hideCloseButton ||
          (alert && (
            <ResponsiveDialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="size-4" />
              <span className="sr-only">close</span>
            </ResponsiveDialogClose>
          ))}
        {children}
      </ResponsiveDialogContent>
    </ResponsiveDialogPortal>
  );
});
ResponsiveDialogContent.displayName = "ResponsiveDialogContent";

const ResponsiveDialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 p-4 text-center sm:p-0 sm:text-left",
        className
      )}
      {...props}
    />
  );
};
ResponsiveDialogHeader.displayName = "ResponsiveDialogHeader";

const ResponsiveDialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <footer
      className={cn(
        "flex flex-col gap-4 p-4 max-sm:mt-auto sm:flex-row sm:justify-end sm:gap-2 sm:p-0",
        className
      )}
      {...props}
    />
  );
};
ResponsiveDialogFooter.displayName = "ResponsiveDialogFooter";

const ResponsiveDialogTitle = forwardRef<
  ComponentRef<typeof Title>,
  ComponentPropsWithoutRef<typeof Title>
>(({ className, ...props }, ref) => {
  const { onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogTitle = shouldUseDialog ? Title : DrawerPrimitive.Title;
  return (
    <ResponsiveDialogTitle
      className={cn(
        "font-semibold text-lg leading-none tracking-tight",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

ResponsiveDialogTitle.displayName = "ResponsiveDialogTitle";

const ResponsiveDialogDescription = forwardRef<
  ComponentRef<typeof Description>,
  ComponentPropsWithoutRef<typeof Description>
>(({ className, ...props }, ref) => {
  const { onlyDrawer, onlyDialog } = useResponsiveDialog();
  const isMobile = useMediaQuery("(min-width: 640px)");

  const shouldUseDialog = onlyDialog || (!onlyDrawer && isMobile);
  const ResponsiveDialogDescription = shouldUseDialog
    ? Description
    : DrawerPrimitive.Description;
  return (
    <ResponsiveDialogDescription
      className={cn("text-muted-foreground text-sm", className)}
      ref={ref}
      {...props}
    />
  );
});

ResponsiveDialogDescription.displayName = "ResponsiveDialogDescription";

export {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogOverlay,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
};
