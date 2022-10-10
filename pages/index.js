import { useContext } from "react";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Products";
import axios from "axios";
import { toast } from "react-toastify";

import db from "../utils/db";
import { Store } from "../utils/Store";

export default function Home({ products }) {
	const { state, dispatch } = useContext(Store);
	const { cart } = state;

	const addCartHandler = async (product) => {
		const existItem = cart.cartItems.find((x) => x.slug === product.slug);
		// console.log(existItem.quantity);
		const quantity = existItem ? existItem.quantity + 1 : 1;
		const { data } = await axios.get(`/api/products/${product._id}`);
		// console.log(quantity, data.countInStock);
		if (quantity > data.countInStock) {
			// alert("Product out of stock!");
			toast.error("Product out of stock!");
			return;
		}

		dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
		toast.success("Product added to the cart");
	};

	return (
		<Layout title='Home Page'>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5'>
				{products.map((product) => (
					<ProductItem
						product={product}
						key={product.slug}
						addCartHandler={addCartHandler}
					></ProductItem>
				))}
			</div>
		</Layout>
	);
}

export async function getServerSideProps() {
	await db.connect();
	const products = await Product.find().lean();

	return {
		props: {
			products: products.map(db.convertDocToObj),
		},
	};
}
