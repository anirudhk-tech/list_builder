import { getDiffHours } from "@/lib/utils";
import { ProcessedRedditResponse } from "@/types/reddit";
import { UserUpsert } from "@/types/supabase";

export const useRedditData = () => {
  const handleFetchRedditData = async () => {
    console.log("Checking if user data exists in Supabase...");
    const userCheckResponse = await fetch("/api/supabase/user/fetch", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!userCheckResponse.ok) {
      if (userCheckResponse.status === 404) {
        console.log("User data not found in Supabase.");
      } else {
        throw new Error("Failed to fetch user data from Supabase");
      }
    }

    if (userCheckResponse.ok) {
      // If user data exists, check the last updated date
      const userCheckData = await userCheckResponse.json();

      if (getDiffHours(new Date(), new Date(userCheckData.updated_at)) > 168) {
        console.log("User data is older than 7 days. Fetching new data...");
      } else {
        console.log("User data is up to date. No need to fetch new data.");
        return;
      }
    }

    console.log("Working with Reddit data...");

    const response = await fetch("/api/reddit/process", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch raw Reddit data");
    }

    console.log("Reddit data successfully processed. Upserting to Supabase...");

    const data: ProcessedRedditResponse = await response.json();

    const upsertPayload: UserUpsert = {
      reddit_username: data.raw.user.name,
      raw_data: data.raw,
      summary: data.summary,
      embedding: data.embedding,
    };

    const upsertResponse = await fetch("/api/supabase/user/upsert", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upsertPayload),
    });

    if (!upsertResponse.ok) {
      throw new Error("Failed to upsert Reddit data to Supabase");
    }

    console.log("Reddit data successfully upserted to Supabase.");
  };

  return { handleFetchRedditData };
};
