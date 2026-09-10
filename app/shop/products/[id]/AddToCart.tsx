"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ShopProduct } from "@/lib/shop/commerce";
import { useCart } from "../../components/CartProvider";
import ShopIcon from "../../components/ShopIcon";

export default function AddToCart({ product }: { product: ShopProduct }) {
  const { add } = useCart();
  const router = useRouter();
  const available = product.variants.filter((variant) => variant.available);
  const [variant, setVariant] = useState(available[0]?.name ?? product.variants[0]?.name ?? "One size");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  function addItem(buy = false) {
    if (!variant) {
      setError("Please select an option.");
      return;
    }
    add({ productId: product.id, handle: product.handle, title: product.title, price: product.price, image: product.image, variant });
    setError("");
    setAdded(true);
    if (buy) router.push("/shop/checkout");
  }

  return (
    <div className="detail-purchase">
      <div className="detail-option">
        <b>Select your option</b>
        <div className="sizes">
          {available.map((item) => (
            <button key={item.id} type="button" onClick={() => { setVariant(item.name); setError(""); }} className={variant === item.name ? "active" : ""} aria-pressed={variant === item.name}>
              {item.name}
            </button>
          ))}
        </div>
      </div>
      {error && <p className="shop-form-error" role="alert">{error}</p>}
      <button className="shop-btn-primary detail-purchase-button" type="button" onClick={() => addItem()}>
        {added ? "ADDED TO BAG" : "ADD TO BAG"} <ShopIcon name="bag" size={20} />
      </button>
      <button className="shop-btn-light detail-purchase-button" type="button" onClick={() => addItem(true)}>
        BUY NOW <ShopIcon name="arrow" size={18} />
      </button>
      <div className="detail-services">
        <span><ShopIcon name="truck" size={18} /> Free shipping on this pair</span>
        <span><ShopIcon name="return" size={18} /> Easy 30-day returns</span>
      </div>
    </div>
  );
}
