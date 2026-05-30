import ProductListing from "../../components/ProductListing";
import { PRODUCT_FILTERS, getProductsByRoom } from "../../data/products";
import "./LivingRoom.css";

function LivingRoom() {
  return (
    <ProductListing
      classPrefix="livingroom"
      title="Living Room Collection"
      subtitle="Create the perfect gathering space for family and friends"
      products={getProductsByRoom("living-room")}
      filters={PRODUCT_FILTERS["living-room"]}
    />
  );
}

export default LivingRoom;
