import React from "react";
import Link from "next/link";

export default function () {
    return(
        <div className="sticky top-0.5 w-full flex justify-between py-2 px-10 bg-slate-700/50 text-indigo-500 backdrop-blur-sm">
            <span className="text-2xl text-gray-50 text-shadow-md text-shadow-blue-200/80">Music</span>
            <div className="flex justify-center gap-6">
                <Link href="/">Radio</Link>
                <Link href="/stream">Stream</Link>
            </div>
        </div>
    )
}