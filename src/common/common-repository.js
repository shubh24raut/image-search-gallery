// Photo search function

import api from "./api";

export const searchPhotos = async (data) => {
  const { query, page, per_page } = data;
  let searchQuery = query;
  if (!searchQuery || searchQuery.length < 1) {
    searchQuery = "random";
  }
  try {
    const response = await api.get("/search/photos", {
      params: {
        query: searchQuery,
        page,
        per_page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
};
