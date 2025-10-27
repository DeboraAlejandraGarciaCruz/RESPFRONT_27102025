import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useMetrics } from '../context/MetricsContext';
import '../Styles/ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, fetchProducts } = useProducts();
  const { registerView } = useMetrics();

  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Cargar productos si aún no están en el contexto
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);

        if (products.length === 0) {
          await fetchProducts();
        }

        if (!isMounted) return;

        const found = products.find((p) => p._id === id);
        setProduct(found || null);

        if (found) registerView(id);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando producto:', error);
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, products, fetchProducts, registerView]);

  if (loading) return <p className="loading">Cargando producto...</p>;
  if (!product) return <p className="loading">Producto no encontrado</p>;

  const nextImage = () => {
    setCurrentImage((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  // ✅ Resolver rutas de imagen local/remota
  const resolveImage = (img) =>
    img?.startsWith('http') ? img : `http://localhost:5000/${img}`;

  // Productos relacionados
  const related = products
    .filter(
      (p) =>
        p._id !== product._id &&
        p.categories?.some((c) =>
          product.categories?.some((cat) => cat.name === c.name)
        )
    )
    .slice(0, 4);

  return (
    <div className="product-detail-container">
      <div className="product-main">
        {/* 🖼 Carrusel principal */}
        <div className="product-carousel">
          {product.images?.length > 0 && (
            <>
              <button className="arrow left" onClick={prevImage}>
                ‹
              </button>
              <img
                src={resolveImage(product.images[currentImage])}
                alt={product.name}
                className="main-photo"
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
              <button className="arrow right" onClick={nextImage}>
                ›
              </button>
            </>
          )}

          <div className="thumbs">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={resolveImage(img)}
                alt={`${product.name} ${i}`}
                className={i === currentImage ? 'thumb active' : 'thumb'}
                onClick={() => setCurrentImage(i)}
                onError={(e) => (e.target.src = '/placeholder.png')}
              />
            ))}
          </div>
        </div>

        {/* 📝 Información del producto */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>
          <p className="price">${product.price}</p>

          <p>
            <strong>Colores:</strong>{' '}
            {product.colors?.map((c) => c.name).join(', ') ||
              'No especificados'}
          </p>

          <p>
            <strong>Categorías:</strong>{' '}
            {product.categories?.map((c) => c.name).join(', ')}
          </p>

          <Link to="/contacto" className="btn-primary">
            Contáctanos
          </Link>

          <button className="btn-outline">Añadir a Favoritos</button>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="related-section">
        <h2>Productos Relacionados</h2>
        <div className="related-grid">
          {related.map((p) => (
            <div key={p._id} className="related-card">
              <Link to={`/producto/${p._id}`}>
                <img
                  src={resolveImage(p.images?.[0])}
                  alt={p.name}
                  onError={(e) => (e.target.src = '/placeholder.png')}
                />
                <div className="info">
                  <h3>{p.name}</h3>
                  <p>${p.price}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
