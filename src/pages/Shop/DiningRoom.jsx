import ProductListing from "../../components/ProductListing";
import { PRODUCT_FILTERS, getProductsByRoom } from "../../data/products";
import "./DiningRoom.css";

function DiningRoom() {
  return (
    <ProductListing
      classPrefix="diningroom"
      title="Dining Room Collection"
      subtitle="Elevate your dining experience with elegant and functional furniture"
      products={getProductsByRoom("dining-room")}
      filters={PRODUCT_FILTERS["dining-room"]}
    />
  );
}

export default DiningRoom;
