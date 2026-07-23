import { createSlice } from "@reduxjs/toolkit";
import {
  getMenus,
  createMenu,
  addItemToMenu,
  deleteMenuCategory,
  getAvailableFoodItems,
  createFoodItem,
  deleteFoodItem,
  generateFoodDescription,
} from "../actions/menuActions";

const initialState = {
  menus: [],
  menuId: null,
  loading: false,
  error: null,

  creating: false,
  createError: null,

  addingItem: false,
  addError: null,

  deletingMenuCategory: false,
  deleteMenuCategoryError: null,

  availableItems: [],
  availableItemsLoading: false,
  availableItemsError: null,

  creatingFood: false,
  createFoodError: null,

  deletingFood: false,
  deleteFoodError: null,

  generatingDescription: false,
  aiDescription: null,
  aiDescriptionError: null,
};

const menuSlice = createSlice({
  name: "menus",
  initialState,
  reducers: {
    clearMenuErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.addError = null;
      state.deleteMenuCategoryError = null;
      state.availableItemsError = null;
      state.createFoodError = null;
      state.deleteFoodError = null;
      state.aiDescriptionError = null;
    },
    clearAiDescription: (state) => {
      state.aiDescription = null;
    },
  },

  extraReducers: (builder) => {
    builder
      //GET MENUS
      .addCase(getMenus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload.menu;
        state.menuId = action.payload.menuId;
      })
      .addCase(getMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //CREATE MENU
      .addCase(createMenu.pending, (state) => {
        state.creating = true;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.creating = false;
        state.menus = action.payload.menu;
        state.menuId = action.payload._id;
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })

      //ADD ITEM
      .addCase(addItemToMenu.pending, (state) => {
        state.addingItem = true;
      })
      .addCase(addItemToMenu.fulfilled, (state, action) => {
        state.addingItem = false;
        // Backend returns the full, freshly-populated menu document,
        // so the store can be updated directly without a re-fetch.
        state.menus = action.payload.menu;
      })
      .addCase(addItemToMenu.rejected, (state, action) => {
        state.addingItem = false;
        state.addError = action.payload;
      })

      //DELETE MENU CATEGORY
      .addCase(deleteMenuCategory.pending, (state) => {
        state.deletingMenuCategory = true;
      })
      .addCase(deleteMenuCategory.fulfilled, (state, action) => {
        state.deletingMenuCategory = false;
        state.menus = state.menus.filter(
          (menu) => menu._id !== action.payload.menuId
        );
      })
      .addCase(deleteMenuCategory.rejected, (state, action) => {
        state.deletingMenuCategory = false;
        state.deleteMenuCategoryError = action.payload;
      })

      //GET AVAILABLE FOOD ITEMS
      .addCase(getAvailableFoodItems.pending, (state) => {
        state.availableItemsLoading = true;
      })
      .addCase(getAvailableFoodItems.fulfilled, (state, action) => {
        state.availableItemsLoading = false;
        state.availableItems = action.payload;
      })
      .addCase(getAvailableFoodItems.rejected, (state, action) => {
        state.availableItemsLoading = false;
        state.availableItemsError = action.payload;
      })

      //CREATE FOOD ITEM
      .addCase(createFoodItem.pending, (state) => {
        state.creatingFood = true;
      })
      .addCase(createFoodItem.fulfilled, (state, action) => {
        state.creatingFood = false;
        state.availableItems.push(action.payload);
      })
      .addCase(createFoodItem.rejected, (state, action) => {
        state.creatingFood = false;
        state.createFoodError = action.payload;
      })

      //DELETE FOOD ITEM
      .addCase(deleteFoodItem.pending, (state) => {
        state.deletingFood = true;
      })
      .addCase(deleteFoodItem.fulfilled, (state, action) => {
        state.deletingFood = false;
        state.menus = state.menus.map((menu) => ({
          ...menu,
          items: menu.items.filter(
            (item) => item._id !== action.payload.foodId
          ),
        }));
      })
      .addCase(deleteFoodItem.rejected, (state, action) => {
        state.deletingFood = false;
        state.deleteFoodError = action.payload;
      })

      //GENERATE AI DESCRIPTION
      .addCase(generateFoodDescription.pending, (state) => {
        state.generatingDescription = true;
      })
      .addCase(generateFoodDescription.fulfilled, (state, action) => {
        state.generatingDescription = false;
        state.aiDescription = action.payload.description;
      })
      .addCase(generateFoodDescription.rejected, (state, action) => {
        state.generatingDescription = false;
        state.aiDescriptionError = action.payload;
      });
  },
});

export const { clearMenuErrors, clearAiDescription } = menuSlice.actions;

export default menuSlice.reducer;
