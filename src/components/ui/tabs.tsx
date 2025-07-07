"use client";

import { Content, List, Root, Trigger } from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import type * as React from "react";
import { createContext, useContext, useId, useState } from "react";

import { cn } from "~/lib/utils";

const TabsContext = createContext<{ value: string; id: string }>({
  value: "",
  id: "",
});

function Tabs({ className, ...props }: React.ComponentProps<typeof Root>) {
  const id = useId();
  const [value, setValue] = useState(props.defaultValue);

  return (
    <TabsContext.Provider value={{ value: value ?? "", id }}>
      <Root
        {...props}
        className={cn("flex flex-col gap-2", className)}
        data-slot="tabs"
        onValueChange={setValue}
        value={value}
      />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof List>) {
  return (
    <List
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        className
      )}
      data-slot="tabs-list"
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<typeof Trigger>) {
  const { value: activeValue, id } = useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <Trigger
      {...props}
      className={cn(
        "group relative z-20 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center whitespace-nowrap px-2 py-1 font-medium text-foreground text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      data-slot="tabs-trigger"
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
      value={value}
    >
      <span className="z-30 inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap group-data-[state=active]:text-foreground">
        {children}
      </span>
      {isActive && (
        <motion.div
          className="absolute inset-0 z-10 rounded-md border shadow-sm dark:border-input"
          layoutId={`active-tab-indicator-${id}`}
          transition={{
            type: "spring",
            bounce: 0.25,
            duration: 0.5,
          }}
        />
      )}
    </Trigger>
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof Content>) {
  return (
    <Content
      className={cn("flex-1 outline-none", className)}
      data-slot="tabs-content"
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
