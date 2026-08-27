"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type ConfirmationTone = "primary" | "success" | "warning" | "danger";

type ConfirmationOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmationTone;
};

type ConfirmationRequest = ConfirmationOptions & {
  resolve: (confirmed: boolean) => void;
};

type ConfirmAction = (options: ConfirmationOptions) => Promise<boolean>;

const ConfirmationContext = createContext<ConfirmAction | null>(null);

const toneStyles: Record<
  ConfirmationTone,
  {
    icon: typeof HelpCircle;
    accentClass: string;
    iconClass: string;
    buttonClass: string;
  }
> = {
  primary: {
    icon: HelpCircle,
    accentClass: "via-blue-500/80",
    iconClass: "border-blue-500/25 bg-blue-500/10 text-blue-400",
    buttonClass:
      "bg-blue-600 text-white shadow-lg shadow-blue-950/30 hover:bg-blue-500 focus-visible:ring-blue-500/40",
  },
  success: {
    icon: CheckCircle2,
    accentClass: "via-emerald-500/80",
    iconClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    buttonClass:
      "bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-500 focus-visible:ring-emerald-500/40",
  },
  warning: {
    icon: AlertTriangle,
    accentClass: "via-amber-500/80",
    iconClass: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    buttonClass:
      "bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/20 hover:bg-amber-400 focus-visible:ring-amber-500/40",
  },
  danger: {
    icon: AlertCircle,
    accentClass: "via-red-500/80",
    iconClass: "border-red-500/25 bg-red-500/10 text-red-400",
    buttonClass:
      "bg-red-600 text-white shadow-lg shadow-red-950/30 hover:bg-red-500 focus-visible:ring-red-500/40",
  },
};

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<ConfirmationRequest | null>(null);

  const confirm = useCallback<ConfirmAction>((options) => {
    return new Promise<boolean>((resolve) => {
      setRequest((current) => {
        current?.resolve(false);
        return { ...options, resolve };
      });
    });
  }, []);

  const respond = useCallback((confirmed: boolean) => {
    setRequest((current) => {
      current?.resolve(confirmed);
      return null;
    });
  }, []);

  const tone = request?.tone ?? "primary";
  const styles = toneStyles[tone];
  const Icon = styles.icon;

  const contextValue = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}

      <AlertDialog
        open={Boolean(request)}
        onOpenChange={(open) => !open && respond(false)}
      >
        <AlertDialogContent className="overflow-hidden border-slate-700/80 bg-slate-900 p-0 text-white sm:max-w-md">
          <div
            className={cn(
              "h-1 bg-gradient-to-r from-transparent to-transparent",
              styles.accentClass,
            )}
          />
          <div className="p-5 sm:p-6">
            <AlertDialogHeader className="items-center text-center sm:items-start sm:text-left">
              <div
                className={cn(
                  "mb-2 flex size-12 items-center justify-center rounded-2xl border",
                  styles.iconClass,
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <AlertDialogTitle className="text-xl leading-7 text-white">
                {request?.title}
              </AlertDialogTitle>
              <AlertDialogDescription className="max-w-sm leading-6 text-slate-400">
                {request?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <AlertDialogCancel
                onClick={() => respond(false)}
                className="h-11 w-full border-slate-700 bg-slate-800/70 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                {request?.cancelLabel ?? "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => respond(true)}
                className={cn("h-11 w-full", styles.buttonClass)}
              >
                {request?.confirmLabel ?? "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error("useConfirmation must be used within ConfirmationProvider");
  }

  return context;
}
