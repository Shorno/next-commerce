import React, {Suspense} from "react";
import {FacebookIcon, GithubIcon, LinkedinIcon, PhoneIcon} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import Newsletter from "@/components/store/layout/navbar/Newsletter";
import Link from "next/link";
import RandomSubcategory, {RandomSubcategorySkeleton} from "@/components/store/layout/navbar/RandomSubcategory";

const sections = [
    {
        title: "Customer Care",
        links: [
            {name: "My Account", href: "#"},
            {name: "Track Order", href: "#"},
            {name: "Customer Service", href: "#"},
            {name: "Return/Exchange", href: "#"},
            {name: "FAQs", href: "#"},
        ],
    },
];

const socialLinks = [
    {icon: <GithubIcon className="size-5"/>, href: "#", label: "GitHub"},
    {icon: <FacebookIcon className="size-5"/>, href: "#", label: "Facebook"},
    {icon: <LinkedinIcon className="size-5"/>, href: "#", label: "LinkedIn"},
];

export default function Footer() {

    return (
        <section className={"mt-24"}>
            <Newsletter/>
            <div className={"px-4"}>
                <div
                    className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left container mx-auto my-8">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <div className="flex items-center gap-2 lg:justify-start">
                            <p className={"text-2xl font-semibold"}>NE</p>
                        </div>
                        <p className="text-muted-foreground max-w-[70%] text-sm">
                            Empowering Your Online Store: Discover, Shop, and Thrive with Our
                            E-commerce Solutions.
                        </p>
                        <div className={"flex gap-2 text-muted-foreground"}>
                            <PhoneIcon/> 01841151827
                        </div>
                        <ul className="text-muted-foreground flex items-center space-x-6">
                            {socialLinks.map((social, idx) => (
                                <li key={idx} className="hover:text-primary font-medium">
                                    <a href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
                        <Suspense fallback={<RandomSubcategorySkeleton/>}>
                            <RandomSubcategory/>
                        </Suspense>

                        {/* Static sections */}
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="font-bold mb-2">{section.title}</h3>
                                <ul className="text-muted-foreground space-y-3 text-sm">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="hover:text-primary font-medium"
                                        >
                                            <Link href={link.href}>{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <Separator/>
                <div className={"container text-sm mx-auto py-1 text-muted-foreground"}>
                    @Shorno - All rights reserved.
                </div>
            </div>
        </section>
    );
}
