import axios from 'axios'
import React, { useState } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import '../css/Style.css'

//define cart state with atom as a state
const cartState = atom({
    key: "cartState", // must be unique
    default: [] // default value of the cart empty array

})
const productQuery = selector({
    key: "Products", // Should be unique
    get: async ({ get }) => {
        try {
            const res = await axios("https://fakestoreapi.com/products");
            return res.data || [];
        } catch (error) {
            console.log(`ERROR: \n${error}`);
            return [];
        }
    }
});


//Creating a view to display the product fetched from fake api

const FakeProducts = () => {
    //set the state
    const [cart, setCart] = useRecoilState(cartState)
    //add product in cart
    const onAddCartItem = (product) => {
        console.log(cart);
        const isProductInCart = cart.find((item) => item.id === product.id);
        if (!isProductInCart) {
            setCart((prevCart) => [...prevCart, product]);
        }
    };


    //Get the product list from Recoil state
    const dummyProducts = useRecoilValue(productQuery)
    return (
        <>
            <div className='l-flex'>
                <div className='l-fg3'>
                    {
                        dummyProducts.map((product) => (
                            <div className='card' key={product.id}>
                                <img src={product.image} alt="" />
                                <div className='card-body'>
                                    <h2>{product.title}</h2>
                                    <h5>{product.category}</h5>
                                    <p>{product.description}</p>
                                    <h5>(${product.price}) <button onClick={() => onAddCartItem(product)}>{cart.find((item) => item.id === product.id) ? "Added" : "Add To Cart"}</button></h5>
                                </div>

                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}
const Basket = () => {
    const [cart, setCart] = useRecoilState(cartState)
    const removeCart =(product) =>{
    const removeCart = cart.filter((item) => item.id !== product.id);
    setCart(removeCart)
   console.log("ss",removeCart)
   }
    return (
    <> 
    <div className='title'> Your Basket</div>
        <div className='basket'>
            {
                !cart.length ? "No Items"
                    : cart.map((product) => (
                        <p key={product.id}>
                            {product.title} (${product.price})
                            <button onClick={()=> removeCart(product)}>Remove</button>
                        </p>
                    ))
            }
        </div>
        <div className='total'>TOTAL:{cart.reduce((prev,curr) => prev + curr.price,0)} </div>
    </>
    )
}
const Home = () => {

    return (
        <div>
            <React.Suspense fallback={<div>Loading...</div>}>
                <FakeProducts />
            </React.Suspense>
            <div className='floatcart'>
                <Basket />
            </div>
        </div>
    )
}

export default Home