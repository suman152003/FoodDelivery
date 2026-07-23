import {createSlice} from "@reduxjs/toolkit"

const initialState ={
    loading: false,
    error:null,
    order:null,
    orders:[],
    allOrders:[],
    totalAmount:0,
    updating:false,
    updateError:null
}

const orderSlice = createSlice({
    name:"order",
    initialState,
    reducers:{
        ////common
        clearErrors:(state)=>{
            state.error= null
        },
        //create order
        createOrderRequest:(state)=>{
            state.loading=true;
        },
        createOrderSuccess:(state,action)=>{
            state.loading= false,
            state.order= action.payload
        },
        createOrderFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },
        //payment
        paymentRequest:(state)=>{
            state.loading=true;
        },
        paymentSuccess:(state)=>{
            state.loading= false   
        },
        paymentFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },

        //My orders
        myOrdersRequest:(state)=>{
            state.loading=true;
        },
        myOrdersSuccess:(state,action)=>{
            state.loading= false,
            state.orders= action.payload
        },
        myOrdersFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },

        // Order details
        orderDetailsRequest:(state)=>{
            state.loading=true;
        },
        orderDetailsSuccess:(state,action)=>{
            state.loading= false,
            state.order= action.payload
        },
        orderDetailsFail:(state,action)=>{
             state.loading= false,
            state.error= action.payload
        },

        // Admin - all orders
        allOrdersRequest:(state)=>{
            state.loading=true;
        },
        allOrdersSuccess:(state,action)=>{
            state.loading= false;
            state.allOrders= action.payload.orders;
            state.totalAmount= action.payload.totalAmount;
        },
        allOrdersFail:(state,action)=>{
             state.loading= false;
            state.error= action.payload
        },

        // Admin - update order status
        updateOrderStatusRequest:(state)=>{
            state.updating=true;
            state.updateError=null;
        },
        updateOrderStatusSuccess:(state,action)=>{
            state.updating= false;
            const updated = action.payload;
            const index = state.allOrders.findIndex((o) => o._id === updated._id);
            if (index !== -1) {
                state.allOrders[index] = updated;
            }
        },
        updateOrderStatusFail:(state,action)=>{
             state.updating= false;
            state.updateError= action.payload
        },

    }
})

export const {
    clearErrors,
    createOrderRequest,
    createOrderSuccess,
    createOrderFail,
    paymentRequest,
    paymentSuccess,
    paymentFail,
    myOrdersRequest,
    myOrdersSuccess,
    myOrdersFail,
    orderDetailsRequest,
    orderDetailsSuccess,
    orderDetailsFail,
    allOrdersRequest,
    allOrdersSuccess,
    allOrdersFail,
    updateOrderStatusRequest,
    updateOrderStatusSuccess,
    updateOrderStatusFail
} = orderSlice.actions

export default orderSlice.reducer