"use client";

import Link from "next/link";
import { useCart } from "../components/CartProvider";
import ProductArt from "../components/ProductArt";
import ShopIcon from "../components/ShopIcon";

export default function CartPage() {
  const { lines, count, subtotal, setQty, remove } = useCart();

  if (!lines.length) {
    return <div className="page-container empty-state"><ShopIcon name="bag" size={48} /><h1>YOUR BAG&apos;S READY FOR ADVENTURE.</h1><p>All it needs is your next favorite piece.</p><Link className="shop-btn-primary" href="/shop/products">FIND YOUR FOOTWEAR <ShopIcon name="arrow" size={18} /></Link></div>;
  }

  return (
    <div className="page-container cart-page">
      <div className="breadcrumb"><Link href="/shop">Home</Link><span>/</span><span>Your bag</span></div>
      <div className="outdoor-section-heading"><h1>YOUR NEXT ADVENTURE. <span className="title-count">({count})</span></h1><Link className="outdoor-text-link" href="/shop/products">KEEP EXPLORING <ShopIcon name="arrow" size={17} /></Link></div>
      <div className="checkout-layout">
        <div>
          <p className="shipping-progress"><ShopIcon name="truck" size={19} />{subtotal >= 75 ? "You’ve unlocked free shipping. Let’s get outside." : `You’re $${(75 - subtotal).toFixed(2)} away from free shipping.`}</p>
          <div className="cart-items">
            {lines.map((line) => {
              const product = { title: line.title, handle: line.handle, image: line.image, category: "footwear", price: line.price };
              return <article className="cart-line" key={`${line.productId}-${line.variant}`}>
                <Link href={`/shop/products/${product.handle}`} className="cart-product-image"><ProductArt image={product.image} title={product.title} className="cart-product-art" /></Link>
                <div className="cart-line-info"><p className="outdoor-eyebrow">{product.category}</p><Link className="cart-product-title" href={`/shop/products/${product.handle}`}>{product.title}</Link><p>{line.variant}</p><div className="quantity-control"><button aria-label={`Decrease ${product.title} quantity`} disabled={line.quantity <= 1} onClick={() => setQty(line.productId, line.variant, line.quantity - 1)}>−</button><span aria-live="polite">{line.quantity}</span><button aria-label={`Increase ${product.title} quantity`} disabled={line.quantity >= 10} onClick={() => setQty(line.productId, line.variant, line.quantity + 1)}>+</button></div><button className="underlined remove-link" onClick={() => remove(line.productId, line.variant)} type="button">Remove</button></div>
                <b>${(product.price * line.quantity).toFixed(2)}</b>
              </article>;
            })}
          </div>
        </div>
        <aside className="order-summary"><h2>ORDER SUMMARY</h2><div className="summary-row"><span>Subtotal ({count} items)</span><span>${subtotal.toFixed(2)}</span></div><div className="summary-row"><span>Shipping</span><span>{subtotal >= 75 ? "FREE" : "$8.00"}</span></div><p className="small muted">No tax is charged on demo orders.</p><div className="summary-row summary-total"><span>Total</span><span>${(subtotal + (subtotal >= 75 ? 0 : 8)).toFixed(2)}</span></div><Link className="shop-btn-primary full" href="/shop/checkout">CHECKOUT <ShopIcon name="arrow" size={19} /></Link><p className="secure-note"><ShopIcon name="lock" size={15} /> Secure demo checkout with ShieldPay</p><div className="payment-marks"><b>VISA</b><b>mastercard</b><b>AMEX</b><b>RuPay</b></div><p className="summary-return"><ShopIcon name="return" size={18} /> Easy returns. More peace of mind.</p></aside>
      </div>
    </div>
  );
}
