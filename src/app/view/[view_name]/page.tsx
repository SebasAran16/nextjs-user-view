"use client";
import React, { useEffect, useState } from "react";

interface viewPageProps {
  params: { view_name: string };
}

export default function ViewPage({ params }: viewPageProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO Get data from view_name
  }, []);
  return !loading ? <h1>{params.view_name}</h1> : "Loading...";
}
