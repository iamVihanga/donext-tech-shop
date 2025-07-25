import { Logo } from "@/components/logo";
import Socials from "@/components/socials";
import { SOCIALS } from "@/lib/constants";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { IconSocial } from "@tabler/icons-react";
import { HeadphonesIcon, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 py-20">
        <div className="content-container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our products or need technical support? We're
            here to help! Get in touch with our expert team.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16">
        <div className="content-container mx-auto">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl mx-auto">
                Whether you need product recommendations, technical support, or
                have questions about your order, our team is ready to assist
                you. Reach out through any of the channels below.
              </p>
            </div>

            {/* Contact Cards - Flex Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Follow Us Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                      <IconSocial className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 text-sm">
                        Follow Us
                      </h3>
                      <div className="flex justify-center space-x-2">
                        {SOCIALS.map((item, i) => (
                          <Link
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={i}
                            className="transition-all duration-200 hover:scale-110"
                          >
                            <item.icon
                              className={`size-6 ${item.social === "Facebook" ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Phone Support Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                      <Phone className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Phone Support
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Call us for immediate assistance
                      </p>
                      <p className="font-medium text-foreground text-xs leading-tight">
                        +94 76 023 0340
                      </p>
                      <p className="font-medium text-foreground text-xs leading-tight">
                        +94 71 930 8389
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mon-Sat, 9AM-8PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Support Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                      <Mail className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Email Support
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Send us an email anytime
                      </p>
                      <p className="font-medium text-foreground text-xs break-all">
                        gamezonetechinfo@gmail.com
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Response within 24hrs
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Our Store Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                      <MapPin className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Visit Our Store
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Come see our products in person
                      </p>
                      <p className="font-medium text-foreground text-xs leading-tight">
                        No.20 Suderis Silva Mawatha, Horana, Sri Lanka
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Mon-Sat, 10AM-7PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Support Card */}
              <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                      <HeadphonesIcon className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 text-sm">
                        Technical Support
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        Expert help with installations
                      </p>
                      <p className="font-medium text-foreground text-xs">
                        Live Chat Available
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Click the chat icon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media - Centered */}
            <div className="text-center max-w-xl mx-auto mt-12">
              <h3 className="font-semibold text-foreground mb-4">
                Stay Connected
              </h3>
              <div className="flex items-center justify-center gap-4">
                <Socials />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Stay updated with our latest products, deals, and tech news
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      {/* <section className="py-16 bg-muted/30">
        <div className="content-container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading mb-4 text-foreground">
              Business Hours
            </h2>
            <p className="text-muted-foreground">
              Our team is available during these hours to assist you
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Store & Support Hours
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium text-foreground">
                      Monday - Friday
                    </span>
                    <span className="text-muted-foreground">
                      9:00 AM - 8:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-medium text-foreground">
                      Saturday
                    </span>
                    <span className="text-muted-foreground">
                      10:00 AM - 7:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-foreground">Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-2">
                    Emergency Support
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    For urgent technical issues with critical systems, email us
                    at{" "}
                    <span className="font-medium text-amber-600">
                      {CONTACTS.email}
                    </span>
                    with "URGENT" in the subject line.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section> */}

      {/* FAQ CTA Section */}
      <section className="py-16">
        <div className="content-container mx-auto text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                Need Quick Answers?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Check out our frequently asked questions for instant answers to
                common queries.
              </p>
              <Button size="lg" variant="outline" asChild>
                <a href="/faq">View FAQ</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
