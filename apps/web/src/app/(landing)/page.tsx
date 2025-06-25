import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Cpu, HardDrive, Monitor, Search, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Gaming Beast Pro X1",
      price: 2499,
      originalPrice: 2799,
      image:
        "https://images.unsplash.com/photo-1729520126776-2235a6baa1f5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.8,
      reviews: 124,
      specs: ["Intel i9-13900K", "RTX 4080", "32GB DDR5", "1TB NVMe SSD"],
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "WorkStation Elite 5000",
      price: 1899,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1723032321111-7ea8b009f7ce?q=80&w=872&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      rating: 4.9,
      reviews: 89,
      specs: ["Intel i7-13700", "RTX 4070", "16GB DDR5", "512GB NVMe SSD"],
      badge: "New Arrival"
    },
    {
      id: 3,
      name: "Budget Builder Starter",
      price: 899,
      originalPrice: 999,
      image:
        "https://images.unsplash.com/photo-1651012998667-2c779fee76f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2FtaW5nJTIwcGN8ZW58MHx8MHx8fDA%3Dhttps://images.unsplash.com/photo-1651012998667-2c779fee76f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8R2FtaW5nJTIwcGN8ZW58MHx8MHx8fDA%3D",
      rating: 4.6,
      reviews: 256,
      specs: ["AMD Ryzen 5 7600", "RTX 4060", "16GB DDR5", "500GB NVMe SSD"],
      badge: "Great Value"
    }
  ];

  const categories = [
    {
      name: "Gaming PCs",
      icon: Cpu,
      count: "150+ Models",
      image:
        "https://plus.unsplash.com/premium_photo-1678112179154-70b9e19f70aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEdhbWluZyUyMHBjfGVufDB8fDB8fHww"
    },
    {
      name: "Workstations",
      icon: Monitor,
      count: "80+ Models",
      image:
        "https://images.unsplash.com/photo-1660855551740-4474188debdb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEdhbWluZyUyMHBjfGVufDB8fDB8fHww"
    },
    {
      name: "Components",
      icon: HardDrive,
      count: "500+ Parts",
      image:
        "https://images.unsplash.com/photo-1688789194475-859b4aced595?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8R2FtaW5nJTIwYWNjZXNvcmllc3xlbnwwfHwwfHx8MA%3D%3D"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Cpu className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold font-heading uppercase text-gray-900">
              ComputerShop
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
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
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Support
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

      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515940175183-6798529cb860?q=80&w=1029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Gaming Setup Banner"
            fill
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 lg:px-6 h-full flex items-center justify-center">
          <div className="text-center text-white space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">
              Premium Gaming PCs
            </h1>
            <p className="text-xl lg:text-2xl opacity-90">
              High-Performance Systems Built for Gamers
            </p>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
            >
              View More
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Gaming PCs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hand-picked systems designed for maximum performance and
              reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-blue-600">
                      {product.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {product.specs.map((spec, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                          {spec}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-gray-900">
                            LKR {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              LKR {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/product/${product.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect computer for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card
                key={index}
                className="group p-0 hover:shadow-xl overflow-hidden transition-all duration-300 cursor-pointer border-0 shadow-lg"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <category.icon className="h-8 w-8 mb-2" />
                      <h3 className="text-xl font-bold">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Professional Gamer",
                content:
                  "The Gaming Beast Pro X1 exceeded all my expectations. The performance is incredible and it handles every game at max settings flawlessly.",
                rating: 5
              },
              {
                name: "Sarah Chen",
                role: "3D Artist",
                content:
                  "Perfect workstation for my 3D rendering work. The build quality is exceptional and customer service was outstanding.",
                rating: 5
              },
              {
                name: "Mike Rodriguez",
                role: "Content Creator",
                content:
                  "Great value for money with the Budget Builder. It handles streaming and video editing without any issues.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Cpu className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">ComputerShop</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for high-performance computers and gaming
                systems.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Gaming PCs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Workstations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Components
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} TechHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
