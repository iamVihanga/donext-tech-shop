import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@repo/ui/components/tabs";
import {
  Cpu,
  Headphones,
  Heart,
  Search,
  Share2,
  Shield,
  Star,
  Truck,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// This would typically come from a database or API
const getProduct = (id: string) => {
  const products = {
    "1": {
      id: 1,
      name: "Gaming Beast Pro X1",
      price: 2499,
      originalPrice: 2799,
      images: [
        "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdhbWluZyUyMHBjfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1671439543718-9e4d009827e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGdhbWluZyUyMHBjfGVufDB8fDB8fHww",
        "https://plus.unsplash.com/premium_photo-1664910795422-527440cfce2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGdhbWluZyUyMHBjfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGdhbWluZyUyMHBjfGVufDB8fDB8fHww"
      ],
      rating: 4.8,
      reviews: 124,
      badge: "Best Seller",
      description:
        "The ultimate gaming machine designed for enthusiasts who demand the best performance. This powerhouse delivers exceptional gaming experiences at 4K resolution with ray tracing enabled.",
      specs: {
        processor: "Intel Core i9-13900K (24 cores, up to 5.8GHz)",
        graphics: "NVIDIA GeForce RTX 4080 16GB GDDR6X",
        memory: "32GB DDR5-5600 RGB RAM",
        storage: "1TB NVMe PCIe 4.0 SSD + 2TB HDD",
        motherboard: "ASUS ROG Strix Z790-E Gaming WiFi",
        cooling: "360mm AIO Liquid Cooling",
        power: "850W 80+ Gold Modular PSU",
        case: "Corsair iCUE 5000X RGB Tempered Glass"
      },
      features: [
        "Pre-installed Windows 11 Pro",
        "RGB Lighting System",
        "Tool-free Upgrades",
        "Cable Management",
        "Overclocking Ready",
        "VR Compatible"
      ],
      benchmarks: {
        "Cyberpunk 2077 (4K Ultra)": "85 FPS",
        "Call of Duty (1440p Ultra)": "165 FPS",
        "Fortnite (1080p Epic)": "240+ FPS",
        "3DMark Time Spy": "18,500 Score"
      },
      inStock: true,
      warranty: "3 Years Premium Warranty",
      shipping: "Free 2-Day Shipping"
    }
  };

  return products[id as keyof typeof products] || null;
};

export default function ProductDetailPage({
  params
}: {
  params: { id: string };
}) {
  const product = getProduct(params.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = [
    {
      id: 2,
      name: "WorkStation Elite 5000",
      price: 1899,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.9
    },
    {
      id: 3,
      name: "Budget Builder Starter",
      price: 899,
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Cpu className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 font-heading">
              ComputerShop
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Gaming PCs
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Workstations
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Components
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-64 px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Cart (0)</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="#" className="hover:text-blue-600">
            Gaming PCs
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-blue-600">
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <p className="text-lg text-gray-600 mb-6">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-bold text-gray-900">
                  LKR {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    LKR {product.originalPrice.toLocaleString()}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive">
                    Save LKR
                    {(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>In Stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>{product.shipping}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>{product.warranty}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span>Wishlist</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>

              <Button variant="outline" size="lg" className="w-full">
                Buy Now - Express Checkout
              </Button>
            </div>

            {/* Key Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span>Key Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="specifications" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Detailed hardware specifications and components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}:
                      </span>
                      <span className="text-gray-600 text-right max-w-xs">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmarks" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>
                  Real-world gaming and application performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(product.benchmarks).map(([game, fps]) => (
                    <div
                      key={game}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900">{game}</span>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {fps}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              {[
                {
                  name: "Alex Thompson",
                  rating: 5,
                  date: "2 weeks ago",
                  title: "Incredible Performance!",
                  content:
                    "This PC exceeded all my expectations. Running Cyberpunk 2077 at 4K with ray tracing at 85+ FPS is just amazing. The build quality is top-notch and the RGB lighting looks fantastic."
                },
                {
                  name: "Sarah Kim",
                  rating: 5,
                  date: "1 month ago",
                  title: "Perfect for Content Creation",
                  content:
                    "As a video editor, this machine handles 4K editing like a breeze. Rendering times are incredibly fast and multitasking is seamless. Highly recommend!"
                },
                {
                  name: "Mike Johnson",
                  rating: 4,
                  date: "3 weeks ago",
                  title: "Great Gaming Machine",
                  content:
                    "Solid performance across all games. The only minor issue is the fan noise under heavy load, but the cooling performance is excellent."
                }
              ].map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            by {review.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            • {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="support" className="mt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Headphones className="h-5 w-5 text-blue-600" />
                    <span>Customer Support</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      24/7 Technical Support
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get help with setup, troubleshooting, and optimization
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Live Chat</h4>
                    <p className="text-gray-600 text-sm">
                      Instant support during business hours
                    </p>
                  </div>
                  <Button className="w-full">Contact Support</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Warranty & Returns</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      3-Year Premium Warranty
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Comprehensive coverage for parts and labor
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">30-Day Return Policy</h4>
                    <p className="text-gray-600 text-sm">
                      Full refund if not completely satisfied
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {relatedProduct.rating}
                        </span>
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        ${relatedProduct.price.toLocaleString()}
                      </div>
                      <Link href={`/product/${relatedProduct.id}`}>
                        <Button size="sm" className="mt-2">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
