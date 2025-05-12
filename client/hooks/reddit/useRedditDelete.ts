import { useRedditDisconnect } from "./user/useRedditDisconnect";

export const useRedditDelete = () => {
  const { handleRedditDisconnect } = useRedditDisconnect();

  const handleDeleteRedditData = async () => {
    console.log("Deleting Reddit data...");

    const response: Response = await fetch("/api/supabase/user/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Reddit data deleted successfully.");
      await handleRedditDisconnect();
    } else {
      console.error("Error deleting Reddit data:", response);
    }

    return response;
  };

  return { handleDeleteRedditData };
};
