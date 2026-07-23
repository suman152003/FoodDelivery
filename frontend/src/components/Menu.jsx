import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getMenus,
  addItemToMenu,
  createMenu,
  deleteMenuCategory,
  getAvailableFoodItems,
  createFoodItem,
  generateFoodDescription,
} from "../redux/actions/menuActions";
import { clearAiDescription } from "../redux/slices/menuSlice";
import { getRestaurants } from "../redux/actions/restaurantAction";
import Fooditem from "./Fooditem";

const Menu = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    menus,
    menuId,
    loading,
    error,
    addError,
    deleteMenuCategoryError,
    availableItemsError,
    createFoodError,
    generatingDescription,
    aiDescription,
  } = useSelector((state) => state.menus);

  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [showMenuCreate, setShowMenuCreate] = useState(false);
  const [newMenuCategory, setNewMenuCategory] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemToAdd, setItemToAdd] = useState({ category: "", foodItemId: "" });

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    dispatch(getMenus(id));
    dispatch(getRestaurants());
  }, [dispatch, id]);

  // Pick up the AI-generated description once it lands in the store.
  useEffect(() => {
    if (aiDescription) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNewFood((prev) => ({ ...prev, description: aiDescription }));
      dispatch(clearAiDescription());
    }
  }, [aiDescription, dispatch]);

  const submitMenuCreation = async (e) => {
    e.preventDefault();
    if (!newMenuCategory) return;

    const result = await dispatch(
      createMenu({ restaurantId: id, category: newMenuCategory })
    );

    if (createMenu.fulfilled.match(result)) {
      setShowMenuCreate(false);
      setNewMenuCategory("");
    }
  };

  const deleteMenuHandler = (menuCategoryId) => {
    if (!window.confirm("Delete this menu category?")) return;
    dispatch(deleteMenuCategory({ restaurantId: id, menuId: menuCategoryId }));
  };

  const openAddItemModal = (category) => {
    setItemToAdd({ category, foodItemId: "" });
    dispatch(getAvailableFoodItems(id));
    setShowAddModal(true);
  };

  const submitNewFood = async (e) => {
    e.preventDefault();

    const payload = {
      ...newFood,
      price: parseFloat(newFood.price) || 0,
      stock: parseInt(newFood.stock) || 0,
      restaurant: id,
    };

    const result = await dispatch(createFoodItem(payload));

    if (createFoodItem.fulfilled.match(result)) {
      const created = result.payload;
      setItemToAdd((prev) => ({ ...prev, foodItemId: created._id }));

      await dispatch(
        addItemToMenu({
          menuId,
          category: itemToAdd.category,
          foodItemId: created._id,
          restaurantId: id,
        })
      );

      setShowAddModal(false);
      setNewFood({
        name: "",
        price: "",
        description: "",
        stock: "",
        imageUrl: "",
      });
    }
  };

  const generateAiDescription = () => {
    if (!newFood.name) {
      alert("Enter name first");
      return;
    }

    dispatch(
      generateFoodDescription({
        name: newFood.name,
        category: itemToAdd.category || "",
        spiceLevel: "Medium",
        price: newFood.price || 0,
      })
    );
  };

  return (
    <div>
      {loading ? (
        <p>Loading menus...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : menus && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id}>
            <div className="d-flex align-items-center">
              <h2 className="mr-2">{menu.category}</h2>

              {isAuthenticated && user && user.role === "admin" && (
                <>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openAddItemModal(menu.category)}
                  >
                    + item
                  </button>

                  <button
                    className="btn btn-sm btn-danger ml-2"
                    onClick={() => deleteMenuHandler(menu._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>

            {deleteMenuCategoryError && (
              <p className="text-danger">{deleteMenuCategoryError}</p>
            )}

            <hr />

            {menu.items && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <Fooditem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <p>No menus available</p>
            )}
          </div>
        ))
      ) : (
        <p> No menus Available</p>
      )}

      {/* add menu button */}
      {isAuthenticated && user && user.role === "admin" && (
        <div className="my-3">
          <button
            className="btn btn-primary"
            onClick={() => setShowMenuCreate(true)}
          >
            + Add Menu
          </button>
        </div>
      )}

      {/* create menu modal */}
      {showMenuCreate && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Create Menu Category</h3>

            <form onSubmit={submitMenuCreation}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  value={newMenuCategory}
                  onChange={(e) => setNewMenuCategory(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Create
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowMenuCreate(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* add item modal */}
      {showAddModal && (
        <div className="create-modal">
          <div className="create-content">
            <h3>Add Food Item</h3>

            {addError && <p className="text-danger">{addError}</p>}
            {availableItemsError && (
              <p className="text-danger">{availableItemsError}</p>
            )}
            {createFoodError && (
              <p className="text-danger">{createFoodError}</p>
            )}

            <form onSubmit={submitNewFood}>
              <div className="form-group">
                <label>Menu Category</label>

                <select
                  value={itemToAdd.category}
                  onChange={(e) =>
                    setItemToAdd({
                      ...itemToAdd,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select</option>
                  {menus.map((m) => (
                    <option key={m._id} value={m.category}>
                      {m.category}
                    </option>
                  ))}
                </select>
              </div>

              <h5 className="mt-3">Create New Food Item</h5>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={newFood.name}
                  onChange={(e) =>
                    setNewFood({ ...newFood, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group d-flex align-items-center">
                <input
                  type="number"
                  placeholder="Price"
                  value={newFood.price}
                  onChange={(e) =>
                    setNewFood({ ...newFood, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group d-flex align-items-center">
                <input
                  type="text"
                  placeholder="Description"
                  value={newFood.description}
                  onChange={(e) =>
                    setNewFood({
                      ...newFood,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="btn btn-sm btn-info ml-2"
                  disabled={generatingDescription}
                  onClick={generateAiDescription}
                >
                  {generatingDescription ? "Generating..." : "AI desc"}
                </button>
              </div>

              <div className="form-group">
                <input
                  type="number"
                  placeholder="Stock"
                  value={newFood.stock}
                  onChange={(e) =>
                    setNewFood({ ...newFood, stock: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newFood.imageUrl}
                  onChange={(e) =>
                    setNewFood({ ...newFood, imageUrl: e.target.value })
                  }
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Add
              </button>

              <button
                className="btn btn-secondary ml-2"
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
