import Link from "next/link";
import StoreNewsletter from "./NewsletterForm";
import ShopIcon from "./ShopIcon";

function FooterLogo() {
  return (
    <span className="shop-brand shop-brand-footer">
      <span className="shop-brand-mountain" aria-hidden><ShopIcon name="mountain" size={27} /></span>
      <span>Northline<sup>®</sup></span>
    </span>
  );
}

export default function StoreFooter() {
  return (
    <>
      <div className="outdoor-benefits">
        <Link href="/shop/shipping"><ShopIcon name="truck" /><div><strong>FREE SHIPPING</strong><span>On all orders $75+</span></div></Link>
        <Link href="/shop/returns"><ShopIcon name="return" /><div><strong>EASY RETURNS</strong><span>30 days to find your fit</span></div></Link>
        <Link href="/shop/about"><ShopIcon name="mountain" /><div><strong>BUILT FOR OUTSIDE</strong><span>Trail-tested. Adventure-ready.</span></div></Link>
        <Link href="/shop/checkout"><ShopIcon name="shield" /><div><strong>SECURE CHECKOUT</strong><span>Protected by ShieldPay</span></div></Link>
      </div>
      <section className="outdoor-newsletter">
        <div>
          <p className="outdoor-eyebrow">MORE OUTSIDE. MORE YOU.</p>
          <h2>GOOD THINGS ARE OUT THERE.</h2>
          <p>Be first to know about new gear, trail stories, and a little inspiration to get out.</p>
        </div>
        <StoreNewsletter />
      </section>
      <footer className="outdoor-footer">
        <div className="outdoor-footer-top">
          <div className="outdoor-footer-brand">
            <FooterLogo />
            <p>Whatever your trail.<br />Let&apos;s get outside.</p>
            <span className="outdoor-demo-label">INDEPENDENT DEMO STOREFRONT</span>
          </div>
          <div>
            <h3>GET OUTSIDE</h3>
            <Link href="/shop/products?gender=men">Shop men</Link>
            <Link href="/shop/products?gender=women">Shop women</Link>
            <Link href="/shop/products?collection=hiking">Hiking</Link>
            <Link href="/shop/products?collection=trail-running">Trail running</Link>
            <Link href="/shop/products?collection=everyday">Everyday</Link>
          </div>
          <div>
            <h3>WE&apos;RE HERE TO HELP</h3>
            <Link href="/shop/account">Order status</Link>
            <Link href="/shop/shipping">Shipping &amp; delivery</Link>
            <Link href="/shop/returns">Returns &amp; exchanges</Link>
            <Link href="/shop/contact">Contact us</Link>
          </div>
          <div>
            <h3>OUR WORLD</h3>
            <Link href="/shop/about">Our story</Link>
            <Link href="/shop/about#responsibility">Our responsibility</Link>
            <Link href="/shop/about#community">The outside is for everyone</Link>
            <p className="outdoor-footer-location"><ShopIcon name="pin" size={16} /> United States · English</p>
          </div>
        </div>
        <div className="outdoor-footer-bottom">
          <span>© {new Date().getFullYear()} Northline. Independent demo. No live payments.</span>
          <div className="outdoor-payment-marks"><b>VISA</b><b>mastercard</b><b>AMEX</b><b>RuPay</b><span><ShopIcon name="shield" size={14} /> ShieldPay</span></div>
        </div>
      </footer>
    </>
  );
}
