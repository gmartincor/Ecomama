import Link from "next/link";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";

interface ActionButtonProps extends Omit<ButtonProps, 'variant'> {
  href?: string;
}

export function ActionButton({ href, className, children, ...props }: ActionButtonProps) {
  const buttonElement = (
    <Button 
      variant="outline" 
      className={`bg-card shadow-sm ${className || ''}`}
      {...props}
    >
      {children}
    </Button>
  );

  if (href) {
    return (
      <Link href={href} className="w-full sm:w-auto">
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
}
