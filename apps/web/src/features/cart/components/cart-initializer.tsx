"use client";

import { useEffect } from "react";
import { useCartStore } from "../store";

export function CartInitializer() {
  const { getCart } = useCartStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  return null;
}
