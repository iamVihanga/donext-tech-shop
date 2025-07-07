import { Logo } from "@/components/logo";
import Socials from "@/components/socials";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import {
  Award,
  GamepadIcon,
  HeadphonesIcon,
  ShieldCheck,
  Star,
  Truck,
  Users
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="content-container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
            About Game Zone Tech
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Your ultimate destination for cutting-edge gaming hardware,
            computers, and tech accessories. We're passionate gamers serving the
            gaming community with premium products and exceptional service.
          </p>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white"
            asChild
          >
            <Link href="/products">Explore Our Products</Link>
          </Button>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="content-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a passion for gaming and technology, Game Zone
                  Tech started as a small venture by tech enthusiasts who
                  understood the needs of serious gamers and professionals.
                </p>
                <p>
                  What began as a local computer shop in Kandy, Sri Lanka, has
                  evolved into a trusted online destination for high-performance
                  gaming rigs, cutting-edge components, and the latest tech
                  accessories.
                </p>
                <p>
                  We believe that everyone deserves access to premium technology
                  that enhances their gaming experience, productivity, and
                  creativity. That's why we carefully curate our product
                  selection to offer only the best in class hardware and
                  accessories.
                </p>
              </div>
            </div>
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-full">
                      <GamepadIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Gaming First
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Built by gamers, for gamers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-full">
                      <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Quality Assured
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Only premium, tested products
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500 rounded-full">
                      <HeadphonesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Expert Support
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Technical guidance when you need it
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="content-container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">
                5000+
              </div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">
                1000+
              </div>
              <p className="text-muted-foreground">Products Available</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">99%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">24/7</div>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-16">
        <div className="content-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">
              What We Offer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From high-end gaming rigs to essential accessories, we provide
              everything you need to elevate your gaming and computing
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <GamepadIcon className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Gaming Hardware</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  High-performance gaming PCs, graphics cards, processors, and
                  components for the ultimate gaming experience.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Custom Builds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized computer builds tailored to your specific needs,
                  whether for gaming, content creation, or professional work.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Tech Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Expert technical support and consultation to help you make the
                  right choices for your gaming and computing needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quick and secure delivery service across Sri Lanka and
                  worldwide, ensuring your gear reaches you safely and on time.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Quality Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our products come with manufacturer warranties and our
                  commitment to quality assurance and customer satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Premium Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We partner with leading tech brands to bring you the latest
                  and greatest in gaming and computing technology.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="content-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">
              Our Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape our commitment
              to the gaming community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Innovation
              </h3>
              <p className="text-muted-foreground">
                We stay ahead of technology trends to bring you the latest and
                most innovative gaming solutions.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Community
              </h3>
              <p className="text-muted-foreground">
                We're part of the gaming community and understand what gamers
                really need and want.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                Excellence
              </h3>
              <p className="text-muted-foreground">
                We strive for excellence in every product we sell and every
                service we provide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16">
        <div className="content-container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                Ready to Level Up?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Join thousands of satisfied customers who trust Game Zone Tech
                for their gaming and computing needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  asChild
                >
                  <Link href="/products">Shop Now</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Follow us on social media
                </p>
                <div className="flex justify-center">
                  <Socials />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
