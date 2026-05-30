import ProductListing from "../../components/ProductListing";
import { PRODUCT_FILTERS, getProductsByRoom } from "../../data/products";
import "./Bedroom.css";

function Bedroom() {
  return (
    <ProductListing
      classPrefix="bedroom"
      title="Bedroom Collection"
      subtitle="Transform your bedroom into a sanctuary of comfort and style"
      products={getProductsByRoom("bedroom")}
      filters={PRODUCT_FILTERS.bedroom}
    />
  );
}

export default Bedroom;
