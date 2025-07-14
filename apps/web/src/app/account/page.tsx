"use client";

import { authClient } from "@/lib/auth-client";
import { UserStats } from "@/modules/account/components/stats";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  Package,
  PackageIcon,
  Settings,
  Shield,
  ShoppingBag,
  ShoppingCartIcon,
  User
} from "lucide-react";
import Link from "next/link";

type Props = {};

export default function AccountPage({}: Props) {
  const {
    data: session,
    error: sessionErr,
    isPending: sessionLoading
  } = authClient.useSession();

  if (sessionLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card
              key={index}
              className="p-0 hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <PackageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="w-full">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="mt-1 h-6 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (sessionErr || !session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Session Error</h3>
          <p className="text-muted-foreground text-center mb-4">
            Unable to load your account information. Please sign in again.
          </p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const user = session.user;
  const sessionInfo = session.session;

  // Generate user initials for avatar fallback
  const getInitials = (name: string, email: string) => {
    if (name && name.trim()) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const userInitials = getInitials(user.name || "", user.email);

  // Format dates
  const joinedDate = formatDistanceToNow(new Date(user.createdAt), {
    addSuffix: true
  });
  const sessionExpiry = formatDistanceToNow(new Date(sessionInfo.expiresAt), {
    addSuffix: true
  });

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <Card className="px-4 py-6">
        <CardContent className="p-0">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || user.email}
              />
              <AvatarFallback className="text-lg font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h1 className="text-2xl font-bold">
                  {user.name || "Welcome!"}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                  {!user.emailVerified && (
                    <Badge variant="secondary" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Unverified
                    </Badge>
                  )}
                  {user.emailVerified && (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinedDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <Badge variant="outline" className="text-xs capitalize">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Session expires {sessionExpiry}</span>
                </div>
              </div>

              {user.banned && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <div className="text-sm">
                    <span className="font-medium text-destructive">
                      Account Banned
                    </span>
                    {user.banReason && (
                      <p className="text-muted-foreground">
                        Reason: {user.banReason}
                      </p>
                    )}
                    {user.banExpires && (
                      <p className="text-muted-foreground">
                        Expires:{" "}
                        {new Date(user.banExpires).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/account/profile">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
              {!user.emailVerified && (
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Verify Email
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <UserStats />

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/account/orders" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">View Orders</p>
                    <p className="text-sm text-muted-foreground">
                      Track your purchases
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>

            <Link href="/cart" className="block">
              <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <ShoppingCartIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Manage Cart</p>
                    <p className="text-sm text-muted-foreground">
                      View all items in your cart
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity / Account Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Account Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Verification Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                {user.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                )}
                <div>
                  <p className="font-medium">Email Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {user.emailVerified ? "Verified" : "Pending verification"}
                  </p>
                </div>
              </div>
              {/* {!user.emailVerified && (
                <Button variant="outline" size="sm">
                  Verify
                </Button>
              )} */}
            </div>

            {/* Profile Completion */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Profile Completion</p>
                  <p className="text-sm text-muted-foreground">
                    {user.name ? "80% complete" : "60% complete"}
                  </p>
                </div>
              </div>
              {/* <Button variant="outline" size="sm" asChild>
                <Link href="/account/profile">Update</Link>
              </Button> */}
            </div>

            {/* Security Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Account Security</p>
                  <p className="text-sm text-muted-foreground">
                    Last login:{" "}
                    {new Date(sessionInfo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {/* <Button variant="outline" size="sm" asChild>
                <Link href="/account/security">Manage</Link>
              </Button> */}
            </div>

            {/* Session Info */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current Session</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Session ID: {sessionInfo.id.slice(0, 8)}...</p>
                <p>
                  Expires: {new Date(sessionInfo.expiresAt).toLocaleString()}
                </p>
                <p>IP: {sessionInfo.ipAddress || "Unknown"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message for New Users */}
      {/* {!user.name && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <User className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
                  Add your name and other details to personalize your shopping
                  experience and get the most out of your account.
                </p>
                <Button className="mt-3" variant="outline" asChild>
                  <Link href="/account/profile">Complete Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
