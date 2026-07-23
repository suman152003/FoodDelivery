import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api"; 

//GET MENUS
export const getMenus = createAsyncThunk(
  "menus/getMenus",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/v1/eats/stores/${id}/menus`);

      let menuData = [];
      let menuDocId = null;
     console.log("getMenus response", response);
      if (response.data.data && response.data.data.length > 0) {
        menuDocId = response.data.data[0]._id;
        menuData = response.data.data[0].menu;
      }

      return { menu: menuData, menuId: menuDocId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//CREATE MENU
export const createMenu = createAsyncThunk(
  "menus/createMenu",
  async ({ restaurantId, category }, { rejectWithValue }) => {
    try {
      const body = {
        restaurant: restaurantId,
        menu: [{ category, items: [] }],
      };

      const { data } = await API.post(
        `/v1/eats/stores/${restaurantId}/menus`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//ADD ITEM
export const addItemToMenu = createAsyncThunk(
  "menus/addItemToMenu",
  async (
    { menuId, category, foodItemId, restaurantId },
    { rejectWithValue }
  ) => {
    try {
      const body = { category, foodItemId };

      const { data } = await API.patch(
        `/v1/eats/stores/${restaurantId}/menus/${menuId}/addItem`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//DELETE MENU CATEGORY
export const deleteMenuCategory = createAsyncThunk(
  "menus/deleteMenuCategory",
  async ({ restaurantId, menuId }, { rejectWithValue }) => {
    try {
      await API.delete(`/v1/eats/stores/${restaurantId}/menus/${menuId}`);
      return { menuId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//GET AVAILABLE FOOD ITEMS FOR A STORE
export const getAvailableFoodItems = createAsyncThunk(
  "menus/getAvailableFoodItems",
  async (storeId, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/v1/eats/items/${storeId}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//CREATE FOOD ITEM
export const createFoodItem = createAsyncThunk(
  "menus/createFoodItem",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/v1/eats/item", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//DELETE FOOD ITEM
export const deleteFoodItem = createAsyncThunk(
  "menus/deleteFoodItem",
  async (foodId, { rejectWithValue }) => {
    try {
      await API.delete(`/v1/eats/item/${foodId}`);
      return { foodId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//GENERATE AI FOOD DESCRIPTION
export const generateFoodDescription = createAsyncThunk(
  "menus/generateFoodDescription",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/v1/ai/generate-food-ai", payload, {
        headers: { "Content-Type": "application/json" },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);