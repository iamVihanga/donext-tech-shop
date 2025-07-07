"use client";

import { Logo } from "@/components/logo";
import { CONTACTS } from "@/lib/constants";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  GamepadIcon,
  HeadphonesIcon,
  Package,
  Search,
  ShieldCheck,
  Truck
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: "general-1",
    question: "What is Game Zone Tech?",
    answer:
      "Game Zone Tech is a premium gaming hardware and computer technology retailer based in Kandy, Sri Lanka. We specialize in high-performance gaming PCs, components, accessories, and provide expert technical support to gamers and tech enthusiasts.",
    category: "general"
  },
  {
    id: "general-2",
    question: "Do you offer custom PC builds?",
    answer:
      "Yes! We offer custom PC building services tailored to your specific needs and budget. Our expert technicians will work with you to design and build the perfect gaming rig or workstation. Contact us for a consultation.",
    category: "general"
  },
  {
    id: "general-3",
    question: "What brands do you carry?",
    answer:
      "We partner with leading technology brands including NVIDIA, AMD, Intel, ASUS, MSI, Corsair, Logitech, Razer, and many more. We carefully select only premium, tested products for our customers.",
    category: "general"
  },

  // Shipping & Delivery
  {
    id: "shipping-1",
    question: "Do you ship worldwide?",
    answer:
      "Yes, we offer worldwide shipping! We provide fast and secure delivery across Sri Lanka and international shipping to most countries. Shipping costs and delivery times vary by location.",
    category: "shipping"
  },
  {
    id: "shipping-2",
    question: "How long does delivery take?",
    answer:
      "Local delivery within Sri Lanka typically takes 1-3 business days. International shipping usually takes 5-15 business days depending on the destination. Express shipping options are available for faster delivery.",
    category: "shipping"
  },
  {
    id: "shipping-3",
    question: "Is shipping free?",
    answer:
      "We offer free shipping on orders over $500 within Sri Lanka. For international orders, shipping costs are calculated based on weight, dimensions, and destination. Check our shipping policy for more details.",
    category: "shipping"
  },
  {
    id: "shipping-4",
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can track your package through our website or directly on the carrier's website. You'll also receive SMS updates for local deliveries.",
    category: "shipping"
  },

  // Orders & Payment
  {
    id: "payment-1",
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and local mobile payment services. All transactions are secured with SSL encryption.",
    category: "payment"
  },
  {
    id: "payment-2",
    question: "Can I modify or cancel my order?",
    answer:
      "You can modify or cancel your order within 2 hours of placing it, provided it hasn't been processed for shipping. After that, please contact our customer service team for assistance.",
    category: "payment"
  },
  {
    id: "payment-3",
    question: "Do you offer installment payments?",
    answer:
      "Yes, we offer installment payment plans for purchases over $1000. You can choose from 3, 6, or 12-month payment plans with competitive interest rates. Contact us for more information.",
    category: "payment"
  },

  // Warranty & Returns
  {
    id: "warranty-1",
    question: "What's your return policy?",
    answer:
      "We offer a 30-day return policy for most items in original condition with packaging. Custom-built PCs have a 14-day return window. Software and digital products are non-returnable unless defective.",
    category: "warranty"
  },
  {
    id: "warranty-2",
    question: "Do products come with warranty?",
    answer:
      "Yes, all products come with manufacturer warranties ranging from 1-5 years depending on the item. We also provide local warranty support and will handle any warranty claims on your behalf.",
    category: "warranty"
  },
  {
    id: "warranty-3",
    question: "What if my product arrives damaged?",
    answer:
      "If your product arrives damaged, contact us immediately with photos of the damage. We'll arrange for a replacement or refund at no cost to you. All shipments are insured for your protection.",
    category: "warranty"
  },

  // Technical Support
  {
    id: "support-1",
    question: "Do you provide technical support?",
    answer:
      "Absolutely! We offer comprehensive technical support including installation guidance, troubleshooting, driver updates, and performance optimization. Our support team is available via phone, email, and live chat.",
    category: "support"
  },
  {
    id: "support-2",
    question: "Do you offer on-site installation?",
    answer:
      "Yes, we provide on-site installation and setup services in the Kandy area and surrounding regions. Remote support is available for software installation and configuration worldwide.",
    category: "support"
  },
  {
    id: "support-3",
    question: "What if I need help choosing components?",
    answer:
      "Our expert team is here to help! We offer free consultation services to help you choose the right components for your needs and budget. Contact us or visit our store for personalized recommendations.",
    category: "support"
  }
];

const categories = [
  { id: "all", name: "All Questions", icon: Search },
  { id: "general", name: "General", icon: GamepadIcon },
  { id: "shipping", name: "Shipping & Delivery", icon: Truck },
  { id: "payment", name: "Orders & Payment", icon: CreditCard },
  { id: "warranty", name: "Warranty & Returns", icon: ShieldCheck },
  { id: "support", name: "Technical Support", icon: HeadphonesIcon }
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="content-container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Find quick answers to common questions about our products, services,
            shipping, and more. Can't find what you're looking for? We're here
            to help!
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="content-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                  <CardDescription>Filter questions by topic</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const count =
                        category.id === "all"
                          ? faqData.length
                          : faqData.filter(
                              (item) => item.category === category.id
                            ).length;

                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                            selectedCategory === category.id
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-r-2 border-amber-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-sm font-medium">
                            {category.name}
                          </span>
                          <span className="text-xs bg-muted px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {filteredFAQs.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-xl font-semibold mb-2">
                        No results found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        We couldn't find any FAQs matching your search. Try
                        adjusting your search terms or browse different
                        categories.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-muted-foreground">
                        Showing {filteredFAQs.length} question
                        {filteredFAQs.length !== 1 ? "s" : ""}
                        {selectedCategory !== "all" &&
                          ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                      </p>
                    </div>

                    {filteredFAQs.map((faq) => (
                      <Card key={faq.id} className="overflow-hidden">
                        <CardHeader
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleItem(faq.id)}
                        >
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg font-medium pr-4">
                              {faq.question}
                            </CardTitle>
                            {openItems.includes(faq.id) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            )}
                          </div>
                        </CardHeader>
                        {openItems.includes(faq.id) && (
                          <CardContent className="pt-0">
                            <Separator className="mb-4" />
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-muted/30">
        <div className="content-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">
              Still Need Help?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is
              ready to assist you with any questions or concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get personalized help from our expert support team
                </p>
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <Truck className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your order or get updates on delivery status
                </p>
                <Button variant="outline">Track Order</Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto p-4 bg-amber-100 dark:bg-amber-900/20 rounded-full w-fit mb-4">
                  <GamepadIcon className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Product Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Need help choosing the right gaming gear?
                </p>
                <Button variant="outline">Get Consultation</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Contact Info */}
      <section className="py-16">
        <div className="content-container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                Quick Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For immediate assistance, you can reach us directly:
              </p>
              <div className="space-y-2">
                <p className="font-medium text-foreground">
                  📞 {CONTACTS.phone}
                </p>
                <p className="font-medium text-foreground">
                  ✉️ {CONTACTS.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  Available Monday-Saturday, 9:00 AM - 8:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
