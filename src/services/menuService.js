import axios from "axios";

export const getMenuData = async (token) => {
  try {
    const response = await axios.get("/api/menu", {
      withCredentials: true,
      headers: {
        Cookie: `firebaseToken=${token}`,
      },
    });

    return response.data.map((item) => {
      // Basic required fields that all menu items need
      const baseMenuItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        imageUrl: item.imageUrl || "",
      };

      // Add optional fields with defaults based on category
      if (item.category === "Frozen Food & Sambal") {
        return {
          ...baseMenuItem,
          // Specific fields or defaults for frozen foods
          description: item.description || "",
          kemasan: item.kemasan || "Pack",
          // Add any frozen-food specific fields here
        };
      }

      // Regular menu items
      return {
        ...baseMenuItem,
        description: item.description || "",
        kemasan: item.kemasan || "Styrofoam",
        // Add any regular-menu specific fields here
      };
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed - token might be invalid or expired",
      );
    }
    // Add more specific error handling if needed
    throw error;
  }
};
