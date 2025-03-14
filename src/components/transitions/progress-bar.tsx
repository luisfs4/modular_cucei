"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"

export function NavigationProgressBar() {
  return <ProgressBar height="3px" color="#000" options={{ showSpinner: false }} shallowRouting />
}

