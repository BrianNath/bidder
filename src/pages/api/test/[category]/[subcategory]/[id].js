export default function handler(req, res) {
  const { category, subcategory, id } = req.query;
  // do something with the `category`, `subcategory`, and `id` parameters
  res
    .status(200)
    .json({
      message: `Received category ${category}, subcategory ${subcategory}, and id ${id}`,
    });
}
