import { Logo } from "@/components/logo";
import Socials from "@/components/socials";
import { CONTACTS, SOCIALS } from "@/lib/constants";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { IconSocial } from "@tabler/icons-react";
import { Clock, HeadphonesIcon, Mail, MapPin, Phone } from "lucide-react";
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

      {/* Contact Information & Form Section */}

      <section className="py-16">
        <div className="content-container mx-auto">
          <div className=" gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold font-heading mb-6 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-muted-foreground mb-8">
                  Whether you need product recommendations, technical support,
                  or have questions about your order, our team is ready to
                  assist you. Reach out through any of the channels below.
                </p>
              </div>
              <div className="space-y-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <IconSocial className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Follow Us
                        </h3>
                        <div className="space-x-4">
                          {SOCIALS.map((item, i) => (
                            <Link
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={i}
                              className="space-x-2 text-background hover:underline transition-all duration-200"
                            >
                              <item.icon
                                className={`inline-block size-8 ${item.social === "Facebook" ? "text-blue-600" : "text-white"}`}
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <Phone className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Phone Support
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Call us for immediate assistance
                        </p>
                        <p className="font-medium text-foreground">
                          {`+94 76 023 0340 / +94 71 930 8389`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Available: Mon-Sat, 9:00 AM - 8:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <Mail className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Email Support
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Send us an email anytime
                        </p>
                        <p className="font-medium text-foreground">
                          {`gamezonetechinfo@gmail.com`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          We'll respond within 24 hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <MapPin className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Visit Our Store
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Come see our products in person
                        </p>
                        <p className="font-medium text-foreground">
                          {`No.20 Suderis Silva Mawatha, Horana, Sri Lanka`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Open: Mon-Sat, 10:00 AM - 7:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <HeadphonesIcon className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Technical Support
                        </h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          Expert help with installations and troubleshooting
                        </p>
                        <p className="font-medium text-foreground">
                          Live Chat Available
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Click the chat icon on our website
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-2">
                  <Socials />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Stay updated with our latest products, deals, and tech news
                </p>
              </div>
            </div>

            {/* <div>
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-heading">
                    Send us a Message
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+94 70 123 4567"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="sales">Sales & Products</option>
                        <option value="order">Order Status</option>
                        <option value="warranty">Warranty & Returns</option>
                        <option value="custom-build">Custom PC Build</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>

                  <Separator />

                  <div className="text-center text-sm text-muted-foreground">
                    <p>
                      By submitting this form, you agree to our{" "}
                      <a href="#" className="text-amber-600 hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-amber-600 hover:underline">
                        Terms of Service
                      </a>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="py-16 bg-muted/30">
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
      </section>

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
