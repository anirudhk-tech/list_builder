import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRedditDelete } from "@/hooks/reddit/useRedditDelete";
import { setDeleteDataDialogState } from "@/store/slices/dialogSlice";
import { MainState } from "@/store/store";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export const DeleteDataDialog = () => {
  const redditUsername = useSelector(
    (state: MainState) => state.user.redditUsername
  );
  const open = useSelector((state: MainState) => state.dialog.deleteDialogOpen);
  const dispatch = useDispatch();
  const { handleDeleteRedditData } = useRedditDelete();

  const handleDelete = async () => {
    if (!redditUsername) {
      toast.error("No Reddit account linked.", {
        description: "Please link your Reddit account to delete your data.",
      });
      return;
    }

    const response: Response = await handleDeleteRedditData();

    if (response.status === 200) {
      toast.success(
        "Reddit data deleted successfully. You will be logged out."
      );
    } else {
      toast.error("Could not delete Reddit data. Please try again.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(state) => dispatch(setDeleteDataDialogState(state))}
    >
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white">
            All records of your data will be deleted from our services. For
            future matching, you will have to sign up again.
          </AlertDialogDescription>
          <AlertDialogDescription className="text-white">
            This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-500">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
