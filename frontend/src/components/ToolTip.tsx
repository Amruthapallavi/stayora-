import * as Tooltip from "@radix-ui/react-tooltip";

interface TooltipWrapperProps {
  content: string;
  children: React.ReactNode;
}

const TooltipWrapper = ({ content, children }: TooltipWrapperProps) => (
  <Tooltip.Provider delayDuration={100}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className="bg-gray-800 text-white px-2 py-1 text-xs rounded shadow-md z-50"
          sideOffset={5}
        >
          {content}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default TooltipWrapper;
