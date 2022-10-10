import Product from "../../../models/Products";
import db from "../../../utils/db";

const handler = async (req, res) => {
	// console.log(req.query.id);
	await db.connect();
	const product = await Product.findById(req.query.slug);
	await db.disconnect();
	res.send(product);
};

export default handler;
