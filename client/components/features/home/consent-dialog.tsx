import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRedditConnect } from "@/hooks/reddit/user/useRedditConnect";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

export interface ConsentDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConsentDialog = ({ open, setOpen }: ConsentDialogProps) => {
  const { handleRedditConnect } = useRedditConnect();

  return (
    <AlertDialog open={open} onOpenChange={(state) => setOpen(state)}>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Here is why we need your Reddit data:
          </AlertDialogTitle>
          <AlertDialogDescription asChild className="text-white">
            <ol className="list-decimal ml-4 space-y-2">
              <li>
                We use your Reddit username to securely link your account to our
                matching service.
              </li>
              <li>
                We fetch your posts and comments so our AI can understand your
                interests.
              </li>
              <li>All data is encrypted in transit and at rest.</li>
              <li>
                You can revoke access at any time and we will immediately erase
                your data from our sources.
              </li>
            </ol>
          </AlertDialogDescription>
          <AlertDialogDescription className="text-white">
            TLDR: We access only your Reddit activity securely for matching and
            you stay in control.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRedditConnect}
            className="bg-red-500"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
